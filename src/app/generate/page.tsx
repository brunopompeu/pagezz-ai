'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { OnboardingData } from '@/types'
import { useAgentStream } from '@/hooks/useAgentStream'
import AgentCard from '@/components/agents/AgentCard'
import AgentStream from '@/components/agents/AgentStream'
import Button from '@/components/ui/Button'

export default function GeneratePage() {
  const router = useRouter()
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null)
  const { agents, activeOutput, overallStatus, start, reset } = useAgentStream()

  useEffect(() => {
    const stored = localStorage.getItem('pagezz_onboarding')
    if (!stored) {
      router.push('/onboarding')
      return
    }
    setOnboarding(JSON.parse(stored) as OnboardingData)
  }, [router])

  function handleGenerate() {
    if (onboarding) start(onboarding)
  }

  function handleReset() {
    reset()
  }

  const activeAgent = agents.find((a) => a.status === 'thinking')
  const errorAgent = agents.find((a) => a.status === 'error')
  const streamStatus = activeAgent ? 'thinking' : overallStatus === 'error' ? 'error' : overallStatus === 'done' ? 'done' : 'idle'
  const streamLabel = activeAgent?.label ?? errorAgent?.label ?? agents[agents.length - 1]?.label

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10">
          <button
            onClick={() => router.push('/onboarding')}
            className="mb-6 flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← Voltar ao início
          </button>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Gerando sua página<span className="text-[var(--primary)]">.</span>
          </h1>
          {onboarding && (
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {onboarding.produto} · {onboarding.nicho}
            </p>
          )}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.name}
              label={agent.label}
              emoji={agent.emoji}
              activity={agent.activity}
              status={agent.status}
              isActive={agent.status === 'thinking'}
            />
          ))}
        </div>

        {(overallStatus === 'running' || overallStatus === 'done' || overallStatus === 'error') && (
          <AgentStream
            output={overallStatus === 'done' ? agents[agents.length - 1]?.output ?? activeOutput : activeOutput}
            status={streamStatus}
            label={streamLabel}
          />
        )}

        {overallStatus === 'idle' && (
          <div className="mt-6 flex justify-center">
            <Button size="lg" onClick={handleGenerate} disabled={!onboarding}>
              ✨ Iniciar Geração
            </Button>
          </div>
        )}

        {overallStatus === 'done' && (
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Pipeline completo — 4 agentes executados com sucesso.
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => router.push('/preview')}>
                👁 Ver minha página
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { handleReset(); router.push('/onboarding') }}>
                + Nova página
              </Button>
            </div>
          </div>
        )}

        {overallStatus === 'error' && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">{activeOutput || 'Erro desconhecido.'}</p>
            <Button variant="ghost" size="sm" className="mt-3" onClick={handleGenerate}>
              Tentar novamente
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
