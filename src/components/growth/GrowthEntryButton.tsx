'use client'
import { useRouter } from 'next/navigation'

export function GrowthEntryButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push('/growth')}
      className="flex items-center gap-2 rounded-xl bg-[var(--eduzz-yellow)] px-5 py-3 text-sm font-bold text-[var(--eduzz-blue)] transition-all hover:-translate-y-0.5 hover:opacity-90"
    >
      📣 Como divulgar isso?
    </button>
  )
}
