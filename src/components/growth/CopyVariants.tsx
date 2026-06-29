'use client'

import { useState } from 'react'
import type { AdCopyVariants } from '@/lib/growth/types'

const BADGE_COLORS = [
  'bg-[var(--primary)] text-[var(--primary-fg)]',
  'bg-[var(--secondary-light)]/20 text-[var(--eduzz-blue)]',
  'bg-green-100 text-green-800',
]

export function CopyVariants({ copy }: { copy: AdCopyVariants }) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyVariant = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1800)
    } catch {}
  }

  return (
    <div className="flex flex-col gap-4">
      {copy.usage && <p className="text-sm text-[var(--text-secondary)]">{copy.usage}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {copy.variants.map((v, i) => {
          const key = `variant-${i}`
          const text = `${v.headline}\n\n${v.primaryText}\n\n${v.cta}`
          return (
            <div
              key={key}
              className="flex flex-col rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5"
            >
              <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_COLORS[i % 3]}`}>
                {v.label}
              </span>

              <h3 className="mt-3 text-base font-bold leading-snug text-[var(--text-primary)]">{v.headline}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">{v.primaryText}</p>
              {v.angle && (
                <p className="mt-2 italic text-xs text-[var(--text-secondary)]">{v.angle}</p>
              )}

              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="rounded-lg bg-[var(--surface-elevated)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">
                  {v.cta}
                </span>
                <button
                  onClick={() => copyVariant(key, text)}
                  className="rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:opacity-80 transition-opacity"
                >
                  {copiedKey === key ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
