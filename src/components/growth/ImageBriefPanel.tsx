'use client'

import { useState } from 'react'
import type { ImageBrief } from '@/lib/growth/types'

const PHOTO_FIELDS: { key: keyof NonNullable<ImageBrief['photoDirection']>; label: string }[] = [
  { key: 'scene', label: 'Cena' },
  { key: 'lighting', label: 'Iluminação' },
  { key: 'outfit', label: 'Figurino' },
  { key: 'expression', label: 'Expressão' },
  { key: 'background', label: 'Fundo' },
]

export function ImageBriefPanel({ brief }: { brief: ImageBrief }) {
  const [copied, setCopied] = useState(false)

  const copyPrompt = async () => {
    if (!brief.aiPrompt) return
    try {
      await navigator.clipboard.writeText(brief.aiPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  const photoOpen = brief.approach === 'photo_direction' || brief.approach === 'both'
  const aiOpen = brief.approach === 'ai_generated'

  return (
    <div className="flex flex-col gap-4">
      {brief.style && (
        <div className="flex items-start gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mt-0.5">
            Estilo
          </span>
          <span className="text-sm text-[var(--text-primary)] leading-relaxed">{brief.style}</span>
        </div>
      )}

      {/* Tirar a foto você mesmo */}
      {brief.photoDirection && (
        <details
          open={photoOpen}
          className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5"
        >
          <summary className="cursor-pointer text-base font-bold text-[var(--text-primary)] select-none">
            📸 Tirar a foto você mesmo
          </summary>

          <div className="mt-4 flex flex-col gap-3">
            {PHOTO_FIELDS.map((f) => {
              const value = brief.photoDirection![f.key]
              if (!value) return null
              return (
                <div key={f.key} className="flex items-start gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mt-0.5 w-24 shrink-0">
                    {f.label}
                  </span>
                  <span className="text-sm text-[var(--text-primary)] leading-relaxed">{value as string}</span>
                </div>
              )
            })}

            {brief.photoDirection.props.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Props</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {brief.photoDirection.props.map((p, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-[var(--surface-elevated)] px-3 py-1 text-xs font-medium text-[var(--text-primary)]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(brief.doList.length > 0 || brief.dontList.length > 0) && (
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {brief.doList.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Faça</p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {brief.doList.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-primary)] leading-relaxed">
                          <span aria-hidden>✅</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {brief.dontList.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Evite</p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {brief.dontList.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-primary)] leading-relaxed">
                          <span aria-hidden>❌</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </details>
      )}

      {/* Gerar com IA */}
      {brief.aiPrompt && (
        <details
          open={aiOpen}
          className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5"
        >
          <summary className="cursor-pointer text-base font-bold text-[var(--text-primary)] select-none">
            🤖 Gerar com IA
          </summary>

          <div className="mt-4 flex flex-col gap-3">
            <div className="bg-[var(--surface-elevated)] rounded-xl p-4 text-sm font-mono whitespace-pre-wrap text-[var(--text-primary)]">
              {brief.aiPrompt}
            </div>
            <button
              onClick={copyPrompt}
              className="self-start rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:opacity-80 transition-opacity"
            >
              {copied ? 'Copiado!' : 'Copiar prompt'}
            </button>
          </div>
        </details>
      )}
    </div>
  )
}
