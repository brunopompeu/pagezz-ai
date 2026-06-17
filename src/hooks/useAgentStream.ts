'use client'

import { useState, useCallback } from 'react'
import type { OnboardingData, AgentState, AgentContext } from '@/types'

export type OverallStatus = 'idle' | 'running' | 'done' | 'error'

export interface PipelineState {
  agents: AgentState[]
  activeOutput: string
  overallStatus: OverallStatus
  start: (data: OnboardingData) => void
  reset: () => void
}

const PIPELINE_DEFS = [
  { name: 'market', label: 'Agente de Mercado', emoji: '🔍', activity: 'analisando seu nicho...' },
  { name: 'product', label: 'Agente de Produto', emoji: '📦', activity: 'mapeando sua oferta...' },
  { name: 'copy', label: 'Agente de Copy', emoji: '✍️', activity: 'estruturando sua página...' },
  { name: 'design', label: 'Agente de Design', emoji: '🎨', activity: 'definindo a estrutura visual...' },
] as const

function makeInitialAgents(): AgentState[] {
  return PIPELINE_DEFS.map((d) => ({
    name: d.name,
    label: d.label,
    emoji: d.emoji,
    activity: d.activity,
    status: 'idle',
    output: '',
  }))
}

async function streamOneAgent(
  name: string,
  onboarding: OnboardingData,
  context: AgentContext,
  onChunk: (text: string) => void,
): Promise<string> {
  const res = await fetch(`/api/agents/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ onboarding, context }),
  })

  if (!res.ok) {
    let msg = `Erro no agente ${name}.`
    try {
      const body = await res.json() as { error?: string }
      if (body.error) msg = body.error
    } catch { /* ignore */ }
    throw new Error(msg)
  }

  if (!res.body) throw new Error(`Sem stream do agente ${name}.`)

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let accumulated = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const payload = line.slice(6).trim()
      if (payload === '[DONE]') return accumulated
      if (payload === '[ERROR]') throw new Error(`Erro ao processar agente ${name}.`)
      try {
        const text = JSON.parse(payload) as string
        accumulated += text
        onChunk(text)
      } catch { /* ignore malformed chunks */ }
    }
  }

  return accumulated
}

export function useAgentStream(): PipelineState {
  const [agents, setAgents] = useState<AgentState[]>(makeInitialAgents())
  const [activeOutput, setActiveOutput] = useState('')
  const [overallStatus, setOverallStatus] = useState<OverallStatus>('idle')

  const reset = useCallback(() => {
    setAgents(makeInitialAgents())
    setActiveOutput('')
    setOverallStatus('idle')
  }, [])

  const start = useCallback(async (data: OnboardingData) => {
    setAgents(makeInitialAgents())
    setActiveOutput('')
    setOverallStatus('running')

    try { localStorage.removeItem('pagezz_context') } catch { /* ignore */ }

    const context: AgentContext = {}

    for (let i = 0; i < PIPELINE_DEFS.length; i++) {
      const { name } = PIPELINE_DEFS[i]

      setAgents((prev) =>
        prev.map((a, idx) => (idx === i ? { ...a, status: 'thinking' } : a)),
      )
      setActiveOutput('')

      try {
        const output = await streamOneAgent(
          name,
          data,
          context,
          (chunk) => setActiveOutput((prev) => prev + chunk),
        )

        setAgents((prev) =>
          prev.map((a, idx) => (idx === i ? { ...a, status: 'done', output } : a)),
        )
        context[name as keyof AgentContext] = output
        try { localStorage.setItem('pagezz_context', JSON.stringify(context)) } catch { /* ignore */ }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro desconhecido.'
        setAgents((prev) =>
          prev.map((a, idx) => (idx === i ? { ...a, status: 'error', output: msg } : a)),
        )
        setActiveOutput(msg)
        setOverallStatus('error')
        return
      }
    }

    setOverallStatus('done')
  }, [])

  return { agents, activeOutput, overallStatus, start, reset }
}
