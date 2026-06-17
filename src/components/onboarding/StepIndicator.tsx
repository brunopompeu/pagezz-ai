'use client'

interface StepIndicatorProps {
  total: number
  current: number
}

export default function StepIndicator({ total, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`
              h-2 rounded-full transition-all duration-300
              ${i < current ? 'w-6 bg-[var(--primary)]' : i === current ? 'w-6 bg-[var(--primary)]' : 'w-2 bg-[var(--border)]'}
            `}
          />
        </div>
      ))}
      <span className="ml-1 text-xs text-[var(--text-secondary)]">
        {current + 1} de {total}
      </span>
    </div>
  )
}
