'use client'

import type { AgentStatus } from '@/types'

interface AgentStreamProps {
  output: string
  status: AgentStatus
  label?: string
}

export default function AgentStream({ output, status, label = 'Agente' }: AgentStreamProps) {
  if (status === 'idle') return null

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5 text-xs text-[var(--text-secondary)]">
        <span className={`h-2 w-2 rounded-full ${status === 'thinking' ? 'bg-[var(--primary)] animate-pulse' : status === 'done' ? 'bg-emerald-400' : 'bg-red-400'}`} />
        {label}
        {status === 'thinking' && <span className="ml-auto">gerando...</span>}
        {status === 'done' && <span className="ml-auto text-emerald-400">✓ concluído</span>}
        {status === 'error' && <span className="ml-auto text-red-400">erro</span>}
      </div>
      <div className="p-4 max-h-[480px] overflow-y-auto">
        {output ? (
          <pre className="whitespace-pre-wrap font-sans text-sm text-[var(--text-primary)] leading-relaxed">
            {output}
            {status === 'thinking' && (
              <span className="inline-block w-0.5 h-4 bg-[var(--primary)] animate-pulse ml-0.5 align-middle" />
            )}
          </pre>
        ) : (
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span className="h-4 w-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            Aguardando resposta da IA...
          </div>
        )}
      </div>
    </div>
  )
}
