'use client'

import { useEffect, useState } from 'react'
import type { ExecutionPlan, WeekPlan } from '@/lib/growth/types'

const TASK_ICON: Record<WeekPlan['tasks'][number]['contentType'], string> = {
  video: '🎬',
  image: '🖼️',
  text: '✍️',
  story: '📖',
  ad: '📣',
}

export function WeeklyPlan({ plan }: { plan: ExecutionPlan }) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      className="flex flex-col gap-6 transition-opacity duration-500"
      style={{ opacity: shown ? 1 : 0 }}
    >
      {/* Quick Wins */}
      {plan.quickWins.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-2">
            Comece por aqui
          </p>
          <div className="flex flex-col gap-2">
            {plan.quickWins.map((qw, i) => (
              <div
                key={i}
                className="rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] px-4 py-3 text-sm font-semibold"
              >
                ⚡ {qw}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weeks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plan.weeks.map((week) => (
          <WeekCard key={week.week} week={week} />
        ))}
      </div>

      {/* Budget Plan */}
      {plan.budgetPlan && (
        <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5">
          <div className="flex items-baseline gap-3 mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Verba semanal
            </p>
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              R$ {plan.budgetPlan.weeklyBudget}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {plan.budgetPlan.breakdown.map((item, i) => {
              const pct = Math.max(0, Math.min(100, item.percentage))
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
                    <span>{item.label}</span>
                    <span className="font-semibold text-[var(--text-primary)]">R$ {item.amount}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-elevated)]">
                    <div
                      className="h-full rounded-full bg-[var(--primary)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function WeekCard({ week }: { week: WeekPlan }) {
  return (
    <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5">
      {/* Header navy */}
      <div className="rounded-t-2xl -mx-5 -mt-5 mb-4 px-5 py-3 bg-[var(--primary-fg)] text-white">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-bold text-sm">Semana {week.week}</span>
          <span className="text-xs" style={{ opacity: 0.8 }}>{week.theme}</span>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-3">
        {week.tasks.map((task, i) => (
          <div key={i} className="flex gap-2.5 items-start">
            <span className="text-base leading-none mt-0.5" aria-hidden>
              {TASK_ICON[task.contentType]}
            </span>
            <div className="flex-1 min-w-0">
              {task.day && (
                <span className="inline-block rounded-full bg-[var(--surface-elevated)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)] mb-1">
                  {task.day}
                </span>
              )}
              <p className="text-sm text-[var(--text-primary)] leading-snug">{task.action}</p>
              {task.tip && (
                <p className="italic text-xs text-[var(--text-secondary)] mt-0.5">{task.tip}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
