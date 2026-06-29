'use client'

import { useState } from 'react'
import type { VideoScript } from '@/lib/growth/types'

const SECTIONS: { key: keyof Pick<VideoScript, 'hook' | 'problem' | 'solution' | 'proof' | 'cta'>; label: string }[] = [
  { key: 'hook', label: 'Hook' },
  { key: 'problem', label: 'Problema' },
  { key: 'solution', label: 'Solução' },
  { key: 'proof', label: 'Prova' },
  { key: 'cta', label: 'CTA' },
]

export function ScriptCard({ script }: { script: VideoScript }) {
  const [copied, setCopied] = useState(false)

  const fullScript = SECTIONS.map((s) => `${s.label}:\n${script[s.key]}`).join('\n\n')

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(fullScript)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Teleprompter sections */}
      <div className="flex flex-col gap-3">
        {SECTIONS.map((s, i) => (
          <div
            key={s.key}
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-[var(--primary-fg)]">
                {i + 1}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                {s.label}
              </span>
            </div>
            <p className="text-base leading-relaxed text-[var(--text-primary)]">{script[s.key]}</p>
          </div>
        ))}
      </div>

      {/* Duration + recording tips */}
      <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            Duração
          </span>
          <span className="rounded-lg bg-[var(--surface-elevated)] px-3 py-1 text-sm font-semibold text-[var(--text-primary)]">
            {script.duration}
          </span>
        </div>

        {script.recordingTips.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Dicas de gravação
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {script.recordingTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-primary)]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-[var(--primary-fg)]">
                    ✓
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Copy full script */}
      <button
        onClick={copyAll}
        className="self-start rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:opacity-80 transition-opacity"
      >
        {copied ? 'Copiado!' : 'Copiar roteiro completo'}
      </button>
    </div>
  )
}
