'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadGrowthState } from '@/lib/growth/context'
import type { ExecutionPlan } from '@/lib/growth/types'
import { WeeklyPlan } from '@/components/growth/WeeklyPlan'

export default function PlanPage() {
  const router = useRouter()
  const [executionPlan, setExecutionPlan] = useState<ExecutionPlan | null>(null)

  useEffect(() => {
    const state = loadGrowthState()
    if (!state?.executionPlan) {
      router.replace('/growth')
    } else {
      setExecutionPlan(state.executionPlan)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="min-h-screen bg-[var(--bg)] flex flex-col">
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col px-4 pb-28">
        {/* Header */}
        <div className="flex items-center gap-3 py-3 border-b border-[var(--border)]">
          <button
            onClick={() => router.push('/growth/strategy')}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← Voltar
          </button>
          <span className="text-sm font-semibold text-[var(--text-primary)]">Seu plano semanal</span>
        </div>

        <div className="mt-4 flex flex-col gap-5">
          {executionPlan ? (
            <WeeklyPlan plan={executionPlan} />
          ) : (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}
        </div>
      </div>

      {/* CTA fixo */}
      {executionPlan && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => router.push('/growth/briefing')}
              className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-[var(--primary-fg)] hover:opacity-90 transition-opacity"
            >
              🎬 Ver meus criativos →
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
