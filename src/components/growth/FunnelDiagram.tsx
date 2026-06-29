'use client'

import { useEffect, useState } from 'react'
import type { FunnelStrategy } from '@/lib/growth/types'

const FUNNEL_TYPE_LABEL: Record<FunnelStrategy['type'], string> = {
  direct_response: 'Resposta direta',
  nurture_webinar: 'Nutrição + Webinar',
  authority_application: 'Autoridade + Aplicação',
  qualification: 'Qualificação',
}

export function FunnelDiagram({ funnel }: { funnel: FunnelStrategy }) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 transition-opacity duration-500"
      style={{ opacity: shown ? 1 : 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Seu funil</h2>
        <span className="rounded-full bg-[var(--surface-elevated)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-primary)]">
          {FUNNEL_TYPE_LABEL[funnel.type]}
        </span>
      </div>

      {/* Timeline vertical */}
      <ol className="mt-5 flex flex-col">
        {funnel.stages.map((stage, i) => {
          const isLast = i === funnel.stages.length - 1
          return (
            <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
              {/* Linha + bolinha */}
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary-fg)] text-xs font-bold text-white">
                  {i + 1}
                </span>
                {!isLast && <span className="mt-1 w-px flex-1 bg-[var(--border)]" />}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-[var(--text-primary)]">{stage.name}</p>
                  {stage.duration && (
                    <span className="rounded-full bg-[var(--surface-elevated)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-secondary)]">
                      {stage.duration}
                    </span>
                  )}
                </div>
                {stage.description && (
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-primary)]">{stage.description}</p>
                )}
                {stage.content && (
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">{stage.content}</p>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      {/* A/B test */}
      {funnel.abTest && (
        <div className="mt-4 rounded-xl bg-[var(--surface-elevated)] p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[var(--text-primary)]">🧪 Teste A/B</span>
            <span className="text-xs text-[var(--text-secondary)]">{funnel.abTest.element}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-[var(--surface)] border border-[var(--border)] p-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">Variante A</p>
              <p className="mt-1 text-sm text-[var(--text-primary)] leading-relaxed">{funnel.abTest.variantA}</p>
            </div>
            <div className="rounded-lg bg-[var(--surface)] border border-[var(--border)] p-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">Variante B</p>
              <p className="mt-1 text-sm text-[var(--text-primary)] leading-relaxed">{funnel.abTest.variantB}</p>
            </div>
          </div>
          {funnel.abTest.metric && (
            <p className="mt-3 text-xs text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">Métrica: </span>
              {funnel.abTest.metric}
            </p>
          )}
        </div>
      )}

      {/* Timeline footer */}
      {funnel.timeline && (
        <p className="mt-4 text-xs text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">⏱ Linha do tempo: </span>
          {funnel.timeline}
        </p>
      )}
    </div>
  )
}
