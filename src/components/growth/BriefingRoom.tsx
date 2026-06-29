'use client'

import { useState } from 'react'
import type { AdCopyVariants, ImageBrief, VideoScript } from '@/lib/growth/types'
import { ScriptCard } from './ScriptCard'
import { CopyVariants } from './CopyVariants'
import { ImageBriefPanel } from './ImageBriefPanel'

type TabId = 'script' | 'copy' | 'image'

export function BriefingRoom({
  videoScript,
  adCopy,
  imageBrief,
}: {
  videoScript?: VideoScript
  adCopy: AdCopyVariants
  imageBrief: ImageBrief
}) {
  const tabs = (
    [
      videoScript && { id: 'script' as const, label: '🎬 Roteiro' },
      { id: 'copy' as const, label: '📣 Copy' },
      { id: 'image' as const, label: '📸 Imagem' },
    ] as ({ id: TabId; label: string } | false | undefined)[]
  ).filter(Boolean) as { id: TabId; label: string }[]

  const [active, setActive] = useState<TabId>(tabs[0].id)

  return (
    <div className="flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === t.id
                ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {active === 'script' && videoScript && <ScriptCard script={videoScript} />}
      {active === 'copy' && <CopyVariants copy={adCopy} />}
      {active === 'image' && <ImageBriefPanel brief={imageBrief} />}
    </div>
  )
}
