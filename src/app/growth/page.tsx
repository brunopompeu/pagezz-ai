'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadPageContextFromBriefing } from '@/lib/growth/context'
import type { PageContext } from '@/lib/growth/types'

export default function GrowthHub() {
  const router = useRouter()
  const [ctx, setCtx] = useState<PageContext | null | 'loading'>('loading')

  useEffect(() => {
    setCtx(loadPageContextFromBriefing())
  }, [])

  if (ctx === 'loading') return null

  return (
    <main className="min-h-screen bg-[#fff8e8] text-[var(--eduzz-blue)] flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[rgba(13,39,114,0.5)]">
            Pagezz AI · Growth
          </p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight">
            Estratégia de<br />divulgação
          </h1>
        </div>

        {ctx ? (
          // Modo post_page — produto detectado
          <div className="rounded-2xl border border-[rgba(13,39,114,0.12)] bg-white p-5 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[rgba(13,39,114,0.4)]">
                Produto detectado
              </p>
              <p className="mt-1 text-lg font-bold">{ctx.product}</p>
              <p className="text-sm text-[rgba(13,39,114,0.55)]">
                {ctx.niche} · {ctx.ticketLabel}
              </p>
            </div>
            <button
              onClick={() => router.push('/growth/discovery?mode=post_page')}
              className="flex items-center justify-between rounded-xl bg-[var(--eduzz-blue)] px-5 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              Gerar minha estratégia de divulgação
              <span aria-hidden>→</span>
            </button>
          </div>
        ) : (
          // Modo direct — sem contexto
          <div className="rounded-2xl border border-[rgba(13,39,114,0.12)] bg-white p-5 flex flex-col gap-4">
            <p className="text-sm text-[rgba(13,39,114,0.68)] leading-relaxed">
              Já tem sua página de vendas? A IA monta canal, funil e criativos prontos pra executar.
            </p>
            <button
              onClick={() => router.push('/growth/discovery?mode=direct')}
              className="flex items-center justify-between rounded-xl bg-[var(--eduzz-blue)] px-5 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              Começar agora
              <span aria-hidden>→</span>
            </button>
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="text-xs text-[rgba(13,39,114,0.4)] hover:text-[var(--eduzz-blue)] transition-colors text-left"
        >
          ← Voltar
        </button>
      </div>
    </main>
  )
}
