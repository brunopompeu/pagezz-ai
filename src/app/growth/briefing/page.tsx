'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadGrowthState } from '@/lib/growth/context'
import type { AdCopyVariants, ImageBrief, VideoScript } from '@/lib/growth/types'
import { BriefingRoom } from '@/components/growth/BriefingRoom'

type Creatives = {
  videoScript?: VideoScript
  adCopy: AdCopyVariants
  imageBrief: ImageBrief
}

export default function BriefingPage() {
  const router = useRouter()
  const [creatives, setCreatives] = useState<Creatives | null>(null)

  useEffect(() => {
    const s = loadGrowthState()
    if (!s?.adCopy || !s?.imageBrief) {
      router.replace('/growth')
      return
    }
    setCreatives({ videoScript: s.videoScript, adCopy: s.adCopy, imageBrief: s.imageBrief })
  }, [router])

  return (
    <main className="min-h-screen bg-[var(--bg)] flex flex-col">
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col px-4 pb-28">
        {/* Header */}
        <div className="flex items-center gap-3 py-3 border-b border-[var(--border)]">
          <button
            onClick={() => router.push('/growth/plan')}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← Voltar
          </button>
          <span className="text-sm font-semibold text-[var(--text-primary)]">Sua sala de criativos</span>
        </div>

        <div className="mt-4">
          {creatives ? (
            <BriefingRoom
              videoScript={creatives.videoScript}
              adCopy={creatives.adCopy}
              imageBrief={creatives.imageBrief}
            />
          ) : (
            <SkeletonCard />
          )}
        </div>
      </div>

      {/* CTA fixo */}
      {creatives && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--surface)] p-3 print:hidden">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => window.print()}
              className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-[var(--primary-fg)] hover:opacity-90 transition-opacity"
            >
              ✅ Plano completo — Imprimir / Salvar PDF
            </button>
          </div>
        </div>
      )}
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
