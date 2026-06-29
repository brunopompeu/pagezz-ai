'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadGrowthState, saveGrowthState } from '@/lib/growth/context'
import type { ChannelStrategy, FunnelStrategy, GrowthState } from '@/lib/growth/types'
import { StrategyCard } from '@/components/growth/StrategyCard'
import { FunnelDiagram } from '@/components/growth/FunnelDiagram'

type Phase = 'idle' | 'channel' | 'funnel' | 'planner' | 'creative' | 'done' | 'error'

export default function StrategyPage() {
  const router = useRouter()
  const startedRef = useRef(false)
  const [channel, setChannel] = useState<ChannelStrategy | null>(null)
  const [funnel, setFunnel] = useState<FunnelStrategy | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function run() {
    const state = loadGrowthState()
    if (!state?.pageContext || !state.discoveryInput) {
      router.replace('/growth')
      return
    }

    // Já gerado anteriormente → hidratar sem re-POST
    if (state.channelStrategy && state.funnelStrategy) {
      setChannel(state.channelStrategy)
      setFunnel(state.funnelStrategy)
      setPhase('done')
      return
    }

    setPhase('channel'); setErrorMsg('')
    try {
      const res = await fetch('/api/growth/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageContext: state.pageContext,
          discoveryInput: state.discoveryInput,
          entryMode: state.entryMode,
        }),
      })
      if (!res.ok || !res.body) throw new Error('Falha na API')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''   // guarda linha parcial
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          let evt: unknown
          try { evt = JSON.parse(line.slice(6)) } catch { continue }
          if (evt === '[DONE]' || evt === '[ERROR]') continue
          const e = evt as { step: string; status?: string; data?: unknown; state?: GrowthState; message?: string }
          if (e.step === 'channel' && e.status === 'done') { setChannel(e.data as ChannelStrategy); setPhase('funnel') }
          else if (e.step === 'funnel' && e.status === 'done') { setFunnel(e.data as FunnelStrategy); setPhase('planner') }
          else if (e.step === 'planner') setPhase('planner')
          else if (e.step === 'creative') setPhase('creative')
          else if (e.step === 'complete' && e.state) { saveGrowthState(e.state); setPhase('done') }
          else if (e.step === 'error') { setErrorMsg(e.message ?? 'Erro ao gerar estratégia'); setPhase('error') }
        }
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro inesperado')
      setPhase('error')
    }
  }

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    void run()
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  const progressLabel: Record<Phase, string> = {
    idle: '', channel: 'Definindo seu canal…', funnel: 'Montando o funil…',
    planner: 'Montando o plano…', creative: 'Criando os criativos…',
    done: '', error: '',
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] flex flex-col">
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col px-4 pb-28">
        {/* Header */}
        <div className="flex items-center gap-3 py-3 border-b border-[var(--border)]">
          <button onClick={() => router.push('/growth')}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            ← Voltar
          </button>
          <span className="text-sm font-semibold text-[var(--text-primary)]">Sua estratégia</span>
        </div>

        {phase === 'error' ? (
          <div className="mt-8 rounded-2xl bg-[var(--surface-elevated)] p-6 text-center">
            <p className="text-sm text-[var(--text-primary)]">{errorMsg}</p>
            <button onClick={() => { setPhase('idle'); void run() }}
              className="mt-4 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-[var(--primary-fg)] hover:opacity-90 transition-opacity">
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-5">
            {channel ? <StrategyCard channel={channel} /> : <SkeletonCard />}
            {funnel ? <FunnelDiagram funnel={funnel} /> : channel ? <SkeletonCard /> : null}

            {phase !== 'done' && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] py-2">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-[var(--text-secondary)]"
                      style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </span>
                {progressLabel[phase]}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA fixo */}
      {phase === 'done' && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => router.push('/growth/plan')}
              className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-[var(--primary-fg)] hover:opacity-90 transition-opacity">
              Ver meu plano semanal →
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </main>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-[var(--surface-elevated)] p-5 animate-pulse">
      <div className="h-4 w-1/3 rounded bg-[var(--border)]" />
      <div className="mt-3 h-3 w-2/3 rounded bg-[var(--border)]" />
      <div className="mt-2 h-3 w-1/2 rounded bg-[var(--border)]" />
    </div>
  )
}
