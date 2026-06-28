'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { OnboardingData, AgentContext } from '@/types'
import type { PageData, ThemeName, HeroStyle } from '@/lib/templates'
import { parseAgentOutputToPageData } from '@/lib/templates/parseAgentOutput'
import Button from '@/components/ui/Button'

// ─── Theme meta ────────────────────────────────────────────────────────────────
const THEMES: { id: ThemeName; label: string; primary: string; bg: string }[] = [
  { id: 'dark-energy',     label: 'Dark Energy',     primary: '#E8410A', bg: '#111111' },
  { id: 'dark-premium',    label: 'Dark Premium',    primary: '#C9A84C', bg: '#0A0A0A' },
  { id: 'corporate-navy',  label: 'Corporate Navy',  primary: '#1E6FD9', bg: '#0B1929' },
]

// ─── Hero thumbnails (simple SVG) ──────────────────────────────────────────────
function HeroAThumbnail({ active }: { active: boolean }) {
  const c = active ? '#E8410A' : '#555'
  return (
    <svg viewBox="0 0 56 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-9">
      <rect width="56" height="36" rx="3" fill="#1a1a1a" />
      {/* left column — text lines */}
      <rect x="4" y="6" width="20" height="3" rx="1" fill={c} />
      <rect x="4" y="12" width="20" height="2" rx="1" fill="#444" />
      <rect x="4" y="16" width="16" height="2" rx="1" fill="#444" />
      <rect x="4" y="22" width="20" height="4" rx="2" fill={c} opacity="0.9" />
      {/* right column — image placeholder */}
      <rect x="30" y="4" width="22" height="28" rx="2" fill="#333" />
      <circle cx="41" cy="14" r="5" fill="#444" />
      <path d="M31 32 Q41 22 51 32" fill="#444" />
    </svg>
  )
}

function HeroBThumbnail({ active }: { active: boolean }) {
  const c = active ? '#E8410A' : '#555'
  return (
    <svg viewBox="0 0 56 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-9">
      <rect width="56" height="36" rx="3" fill="#1a1a1a" />
      {/* full-bleed bg */}
      <rect width="56" height="36" rx="3" fill="#222" />
      {/* centered circle/avatar */}
      <circle cx="28" cy="10" r="5" fill="#444" />
      {/* centered text */}
      <rect x="14" y="18" width="28" height="3" rx="1" fill={c} />
      <rect x="18" y="23" width="20" height="2" rx="1" fill="#444" />
      <rect x="20" y="28" width="16" height="4" rx="2" fill={c} opacity="0.9" />
    </svg>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function PreviewPage() {
  const router = useRouter()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [html, setHtml] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copying, setCopying] = useState(false)
  const [activeTab, setActiveTab] = useState<'venda' | 'obrigado'>('venda')
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [rebuilding, setRebuilding] = useState(false)
  const [obrigadoMounted, setObrigadoMounted] = useState(false)

  // ── Count "suggested" fields that are still empty / short ──────────────────
  const suggestedCount = pageData
    ? [pageData.headline, pageData.subheadline, pageData.textoCta, pageData.nomeProdutor, pageData.garantia]
        .filter(v => !v || v.length < 5).length + (pageData.depoimentos?.filter(d => !d.texto).length ?? 0)
    : 0

  // ── Rebuild HTML from updated PageData ─────────────────────────────────────
  const rebuild = useCallback(async (data: PageData) => {
    setRebuilding(true)
    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) setHtml(await res.text())
    } finally {
      setRebuilding(false)
    }
  }, [])

  // ── Initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    async function generate() {
      const rawOnboarding = localStorage.getItem('pagezz_onboarding')
      const rawContext = localStorage.getItem('pagezz_context')

      if (!rawOnboarding || !rawContext) { router.push('/onboarding'); return }

      const onboarding = JSON.parse(rawOnboarding) as OnboardingData
      const context = JSON.parse(rawContext) as AgentContext

      if (!context.copy || !context.design) {
        setError('Pipeline incompleto. Gere sua página novamente.')
        setLoading(false)
        return
      }

      try {
        const data = parseAgentOutputToPageData(onboarding, context.copy, context.design)
        setPageData(data)

        const res = await fetch('/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) {
          const body = await res.json() as { error?: string }
          throw new Error(body.error ?? 'Erro ao gerar preview.')
        }
        setHtml(await res.text())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido.')
      } finally {
        setLoading(false)
      }
    }
    void generate()
  }, [router])

  useEffect(() => {
    if (html && iframeRef.current) iframeRef.current.srcdoc = html
  }, [html])

  // ── Drawer field helpers ────────────────────────────────────────────────────
  function patch(updates: Partial<PageData>) {
    if (!pageData) return
    const next = { ...pageData, ...updates }
    setPageData(next)
    void rebuild(next)
  }

  const heroImgRef = useRef<HTMLInputElement>(null)

  function setTheme(theme: ThemeName) { patch({ theme }) }
  function setHeroStyle(heroStyle: HeroStyle) { patch({ heroStyle }) }

  function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string
      if (dataUrl) patch({ heroImage: dataUrl })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function handleCopy() {
    if (!html) return
    setCopying(true)
    try { await navigator.clipboard.writeText(html); setTimeout(() => setCopying(false), 2000) }
    catch { setCopying(false) }
  }

  function handleNewPage() {
    localStorage.removeItem('pagezz_context')
    router.push('/onboarding')
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Toolbar */}
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/generate')}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← Voltar
          </button>
          <span className="hidden text-sm font-semibold text-[var(--text-primary)] sm:inline">
            Sua página gerada
          </span>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg border border-[var(--border)] overflow-hidden text-sm">
          <button
            onClick={() => setActiveTab('venda')}
            className={`px-4 py-1.5 transition-colors ${activeTab === 'venda' ? 'bg-[var(--primary)] text-white font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Página de Venda
          </button>
          <button
            onClick={() => { setObrigadoMounted(true); setActiveTab('obrigado') }}
            className={`px-4 py-1.5 transition-colors ${activeTab === 'obrigado' ? 'bg-[var(--primary)] text-white font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Página de Obrigado
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy} disabled={!html || copying}>
            {copying ? '✓ Copiado!' : '⎘ Copiar HTML'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleNewPage}>
            + Nova página
          </Button>
        </div>
      </header>

      {/* Content area */}
      <div className="relative flex-1 overflow-hidden bg-[#111]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
            <p className="text-sm text-[var(--text-secondary)]">Montando sua página…</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-red-400">{error}</p>
            <Button onClick={handleNewPage}>Gerar nova página</Button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Venda — always mounted so srcdoc persists across tab switches */}
            <div className={activeTab === 'venda' ? 'absolute inset-0' : 'hidden'}>
              {rebuilding && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
                </div>
              )}
              <iframe
                ref={iframeRef}
                className="h-full w-full border-0"
                title="Página de Venda"
                sandbox="allow-same-origin"
              />
            </div>

            {/* Obrigado — mounted once on first visit, then kept alive */}
            {obrigadoMounted && (
              <div className={activeTab === 'obrigado' ? 'absolute inset-0' : 'hidden'}>
                <ThankYouPage pageData={pageData} />
              </div>
            )}
          </>
        )}

        {/* ✏️ Personalizar button — fixed over the iframe */}
        {!loading && !error && activeTab === 'venda' && pageData && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="absolute bottom-6 right-6 z-20 flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            ✏️ Personalizar
            {suggestedCount > 0 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {suggestedCount} {suggestedCount === 1 ? 'campo' : 'campos'}
              </span>
            )}
          </button>
        )}
      </div>

      {/* ── Editing drawer ────────────────────────────────────────────────────── */}
      {drawerOpen && pageData && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 z-30 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />

          {/* panel */}
          <aside className="fixed right-0 top-0 z-40 flex h-full w-80 flex-col overflow-y-auto bg-[var(--surface)] shadow-2xl">
            {/* header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Personalizar página</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-6 p-5">
              {/* ── Tema ──────────────────────────────────────────────────── */}
              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Tema</p>
                <div className="flex flex-col gap-2">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
                        pageData.theme === t.id
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                          : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                      }`}
                    >
                      {/* color swatch */}
                      <span className="flex gap-1 shrink-0">
                        <span className="block h-4 w-4 rounded-sm" style={{ background: t.bg }} />
                        <span className="block h-4 w-4 rounded-sm" style={{ background: t.primary }} />
                      </span>
                      <span className="text-sm text-[var(--text-primary)]">{t.label}</span>
                      {pageData.theme === t.id && (
                        <span className="ml-auto text-[var(--primary)] text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* ── Hero ──────────────────────────────────────────────────── */}
              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Hero</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setHeroStyle('a')}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-all ${
                      pageData.heroStyle === 'a'
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                        : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                    }`}
                  >
                    <HeroAThumbnail active={pageData.heroStyle === 'a'} />
                    <span className="text-xs text-[var(--text-secondary)]">Hero A · 50/50</span>
                  </button>

                  <button
                    onClick={() => setHeroStyle('b')}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-all ${
                      pageData.heroStyle === 'b'
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                        : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                    }`}
                  >
                    <HeroBThumbnail active={pageData.heroStyle === 'b'} />
                    <span className="text-xs text-[var(--text-secondary)]">Hero B · Full</span>
                  </button>
                </div>

                {/* Image upload */}
                <div className="mt-3 flex flex-col gap-2">
                  <p className="text-xs text-[var(--text-secondary)]">Foto do hero</p>
                  {pageData.heroImage ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={pageData.heroImage}
                        alt="Hero"
                        className="h-14 w-14 rounded-md object-cover object-top border border-[var(--border)]"
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => heroImgRef.current?.click()}
                          className="text-xs text-[var(--primary)] hover:underline"
                        >
                          Trocar foto
                        </button>
                        <button
                          onClick={() => patch({ heroImage: undefined })}
                          className="text-xs text-[var(--text-secondary)] hover:text-red-400"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => heroImgRef.current?.click()}
                      className="flex items-center gap-2 rounded-lg border border-dashed border-[var(--border)] px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:border-[var(--primary)]/50 hover:text-[var(--text-primary)] transition-colors"
                    >
                      <span>📸</span>
                      <span>Adicionar foto</span>
                    </button>
                  )}
                  <input
                    ref={heroImgRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleHeroImageUpload}
                  />
                </div>
              </section>

              {/* ── Textos ────────────────────────────────────────────────── */}
              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Textos</p>
                <div className="flex flex-col gap-4">
                  <Field
                    label="Headline"
                    value={pageData.headline}
                    multiline
                    onChange={v => patch({ headline: v })}
                  />
                  <Field
                    label="Subheadline"
                    value={pageData.subheadline}
                    multiline
                    onChange={v => patch({ subheadline: v })}
                  />
                  <Field
                    label="Texto do Botão (CTA)"
                    value={pageData.textoCta}
                    onChange={v => patch({ textoCta: v })}
                  />
                  <Field
                    label="Nome do Produtor"
                    value={pageData.nomeProdutor ?? ''}
                    onChange={v => patch({ nomeProdutor: v })}
                    placeholder="Seu nome aqui"
                  />
                  {pageData.preco && (
                    <Field
                      label="Preço (R$)"
                      value={pageData.preco}
                      onChange={v => patch({ preco: v })}
                      placeholder="97"
                    />
                  )}
                  <Field
                    label="Garantia"
                    value={pageData.garantia ?? ''}
                    onChange={v => patch({ garantia: v })}
                    placeholder="7 dias de garantia incondicional"
                  />
                  <Field
                    label="Urgência / Escassez"
                    value={pageData.urgencia ?? ''}
                    onChange={v => patch({ urgencia: v })}
                    placeholder="Últimas vagas disponíveis"
                  />
                </div>
              </section>

              {/* ── Depoimentos ───────────────────────────────────────────── */}
              {(pageData.depoimentos?.length ?? 0) > 0 && (
                <section>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Depoimentos</p>
                  <div className="flex flex-col gap-4">
                    {(pageData.depoimentos ?? []).slice(0, 3).map((d, i) => (
                      <div key={i} className="flex flex-col gap-2 rounded-lg border border-[var(--border)] p-3">
                        <Field
                          label={`Nome ${i + 1}`}
                          value={d.nome}
                          onChange={v => {
                            const next = [...(pageData.depoimentos ?? [])]
                            next[i] = { ...next[i], nome: v }
                            patch({ depoimentos: next })
                          }}
                        />
                        <Field
                          label="Depoimento"
                          value={d.texto}
                          multiline
                          onChange={v => {
                            const next = [...(pageData.depoimentos ?? [])]
                            next[i] = { ...next[i], texto: v }
                            patch({ depoimentos: next })
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* footer */}
            <div className="mt-auto border-t border-[var(--border)] p-5">
              <Button size="sm" className="w-full" onClick={() => setDrawerOpen(false)}>
                Aplicar alterações
              </Button>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}

// ─── Field component ───────────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  multiline,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
}) {
  const inputClass =
    'w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none transition-colors resize-none'

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[var(--text-secondary)]">{label}</label>
      {multiline ? (
        <textarea
          className={inputClass}
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <input
          className={inputClass}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

// ─── Thank-you page ────────────────────────────────────────────────────────────
function ThankYouPage({ pageData }: { pageData: PageData | null }) {
  const [html, setHtml] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    async function generate() {
      const rawOnboarding = localStorage.getItem('pagezz_onboarding')
      const rawContext = localStorage.getItem('pagezz_context')
      if (!rawOnboarding || !rawContext) { setLoading(false); return }

      const onboarding = JSON.parse(rawOnboarding) as OnboardingData
      const context = JSON.parse(rawContext) as AgentContext
      if (!context.copy || !context.design) { setLoading(false); return }

      const data = pageData
        ? { ...pageData, objetivo: 'obrigado' as const }
        : (() => {
            const parsed = parseAgentOutputToPageData(onboarding, context.copy!, context.design!)
            return { ...parsed, objetivo: 'obrigado' as const }
          })()

      try {
        const res = await fetch('/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (res.ok) setHtml(await res.text())
      } finally {
        setLoading(false)
      }
    }
    void generate()
  // pageData intentionally excluded — obrigado page is generated once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (html && iframeRef.current) iframeRef.current.srcdoc = html
  }, [html])

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  return <iframe ref={iframeRef} className="h-full w-full border-0" title="Página de Obrigado" sandbox="allow-same-origin" />
}
