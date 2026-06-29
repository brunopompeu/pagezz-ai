'use client'

import { useEffect, useState } from 'react'
import type { Channel, ChannelStrategy } from '@/lib/growth/types'

const CHANNEL_EMOJI: Record<Channel, string> = {
  tiktok: '📱',
  instagram_reels: '📸',
  instagram_feed: '📸',
  instagram_stories: '📸',
  youtube: '▶️',
  google_ads: '🔍',
  email: '📧',
  whatsapp: '💬',
  facebook: '👍',
  linkedin: '💼',
  kwai: '🎵',
  pinterest: '📌',
}

function channelEmoji(c: Channel): string {
  return CHANNEL_EMOJI[c] ?? '📣'
}

function channelName(c: string): string {
  return c
    .split('_')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}

const APPROACH: Record<ChannelStrategy['approach'], { label: string; className: string }> = {
  organic: { label: 'Orgânico', className: 'bg-green-100 text-green-800' },
  hybrid: { label: 'Híbrido', className: 'bg-[var(--secondary-light)]/20 text-[var(--eduzz-blue)]' },
  paid: { label: 'Pago', className: 'bg-orange-100 text-orange-800' },
}

const ALLOCATION_LABELS: Record<string, string> = {
  testing: 'Teste',
  scaling: 'Escala',
  remarketing: 'Remarketing',
}

export function StrategyCard({ channel }: { channel: ChannelStrategy }) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const approach = APPROACH[channel.approach]

  return (
    <div
      className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 transition-opacity duration-500"
      style={{ opacity: shown ? 1 : 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-2xl leading-none" aria-hidden>{channelEmoji(channel.primaryChannel)}</span>
        <h2 className="text-lg font-bold text-[var(--text-primary)]">{channelName(channel.primaryChannel)}</h2>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${approach.className}`}>
          {approach.label}
        </span>
      </div>

      {/* Canais de apoio */}
      {channel.supportChannels.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-[var(--text-secondary)]">Apoio:</span>
          {channel.supportChannels.map((c) => (
            <span key={c} className="rounded-full bg-[var(--surface-elevated)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-primary)]">
              {channelEmoji(c)} {channelName(c)}
            </span>
          ))}
        </div>
      )}

      {/* Rationale */}
      <p className="mt-4 text-base leading-relaxed text-[var(--text-primary)]">{channel.rationale}</p>

      {/* Organic path */}
      {channel.organicPath && (
        <div className="mt-5 flex flex-col gap-4">
          {channel.organicPath.firstSteps.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Primeiros passos</p>
              <ul className="mt-2 flex flex-col gap-2">
                {channel.organicPath.firstSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-primary)]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-[var(--primary-fg)]">✓</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {channel.organicPath.contentTypes.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Tipos de conteúdo</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {channel.organicPath.contentTypes.map((t, i) => (
                  <span key={i} className="rounded-full bg-[var(--surface-elevated)] px-3 py-1 text-xs font-medium text-[var(--text-primary)]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {channel.organicPath.postingFrequency && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Frequência</span>
              <span className="rounded-lg bg-[var(--surface-elevated)] px-3 py-1 text-sm font-semibold text-[var(--text-primary)]">
                {channel.organicPath.postingFrequency}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Paid path */}
      {channel.paidPath && (
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg bg-[var(--surface-elevated)] px-3 py-1 text-sm text-[var(--text-primary)]">
              <span className="text-[var(--text-secondary)]">Plataforma: </span>
              <span className="font-semibold">{channel.paidPath.platform}</span>
            </span>
            <span className="rounded-lg bg-[var(--surface-elevated)] px-3 py-1 text-sm text-[var(--text-primary)]">
              <span className="text-[var(--text-secondary)]">Campanha: </span>
              <span className="font-semibold">{channel.paidPath.campaignType}</span>
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Alocação de verba</p>
            <div className="mt-2 flex flex-col gap-2.5">
              {(['testing', 'scaling', 'remarketing'] as const).map((key) => {
                const pct = Math.max(0, Math.min(100, channel.paidPath!.budgetAllocation[key] ?? 0))
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>{ALLOCATION_LABELS[key]}</span>
                      <span className="font-semibold text-[var(--text-primary)]">{pct}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-elevated)]">
                      <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {channel.paidPath.audience && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mt-0.5">Público</span>
              <span className="text-sm text-[var(--text-primary)] leading-relaxed">{channel.paidPath.audience}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
