'use client'

import type { AgentStatus } from '@/types'

const STATUS_ICONS: Record<AgentStatus, string> = {
  idle: '○',
  thinking: '◉',
  done: '✓',
  error: '✕',
}

const STATUS_COLORS: Record<AgentStatus, string> = {
  idle: 'text-[var(--text-secondary)]',
  thinking: 'text-[var(--primary)]',
  done: 'text-emerald-400',
  error: 'text-red-400',
}

interface AgentCardProps {
  label: string
  emoji: string
  activity: string
  status: AgentStatus
  isActive?: boolean
  isSelected?: boolean
  onClick?: () => void
}

export default function AgentCard({ label, emoji, activity, status, isActive, isSelected, onClick }: AgentCardProps) {
  const clickable = status === 'done' && onClick
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`
        flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300
        ${clickable ? 'cursor-pointer' : ''}
        ${isSelected
          ? 'border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] ring-2 ring-[var(--primary)]/30'
          : isActive
            ? 'border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]'
            : 'border-[var(--border)] bg-[var(--surface)]'
        }
        ${clickable && !isSelected ? 'hover:border-[var(--primary)]/60 hover:bg-[color-mix(in_srgb,var(--primary)_4%,transparent)]' : ''}
      `}
    >
      <span
        className={`text-lg font-mono transition-colors ${STATUS_COLORS[status]} ${
          status === 'thinking' ? 'animate-pulse' : ''
        }`}
      >
        {STATUS_ICONS[status]}
      </span>
      <div className="flex-1">
        <p className={`text-sm font-medium ${status === 'idle' ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
          {status === 'thinking' ? `${emoji} ${label} ${activity}` : label}
        </p>
        {status === 'done' && (
          <p className="text-xs text-emerald-400 mt-0.5">Concluído</p>
        )}
        {status === 'error' && (
          <p className="text-xs text-red-400 mt-0.5">Erro</p>
        )}
      </div>
    </div>
  )
}
