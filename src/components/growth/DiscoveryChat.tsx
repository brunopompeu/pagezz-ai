'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveGrowthState } from '@/lib/growth/context'
import type { PageContext, DiscoveryInput, GrowthState } from '@/lib/growth/types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

interface Props {
  mode: 'post_page' | 'direct'
  pageContext: PageContext | null
}

type TicketMedio = 'ate-97' | '97-297' | '297-997' | 'acima-997'

const TICKET_MAP: Record<TicketMedio, { ticket: number; ticketLabel: string }> = {
  'ate-97':    { ticket: 97,   ticketLabel: 'até R$97' },
  '97-297':    { ticket: 197,  ticketLabel: 'R$97–297' },
  '297-997':   { ticket: 497,  ticketLabel: 'R$297–997' },
  'acima-997': { ticket: 1997, ticketLabel: 'acima de R$997' },
}

const BUDGET_OPTIONS: { label: string; value: DiscoveryInput['budget'] }[] = [
  { label: 'Não tenho verba', value: 'zero' },
  { label: 'Até R$800/mês', value: 'low' },
  { label: 'R$800 a R$3k/mês', value: 'medium' },
  { label: 'Acima de R$3k/mês', value: 'high' },
]

const HOURS_OPTIONS: { label: string; value: number }[] = [
  { label: 'Até 3h', value: 3 },
  { label: '4 a 8h', value: 6 },
  { label: '9 a 15h', value: 12 },
  { label: 'Mais de 15h', value: 20 },
]

const AUDIENCE_OPTIONS: { label: string; hasAudience: boolean; audienceSize?: number }[] = [
  { label: 'Ainda não', hasAudience: false },
  { label: 'Sim, pequena (<1k)', hasAudience: true, audienceSize: 500 },
  { label: 'Sim, média (1k-10k)', hasAudience: true, audienceSize: 5000 },
  { label: 'Sim, grande (10k+)', hasAudience: true, audienceSize: 20000 },
]

type Phase = 'discovery' | 'operational' | 'ready'
type OpStep = 0 | 1 | 2  // 0=budget, 1=hours, 2=audience

const OP_QUESTIONS = [
  'Você tem verba pra investir em anúncios?',
  'Quantas horas por semana você consegue dedicar à divulgação?',
  'Você já tem audiência? (seguidores, lista de e-mail, grupo)',
]

export function DiscoveryChat({ mode, pageContext }: Props) {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')
  const [apiHistory, setApiHistory] = useState<{ role: string; content: string }[]>([])
  const [growthDiscovery, setGrowthDiscovery] = useState<Record<string, unknown>>({})

  // Phase management
  const [phase, setPhase] = useState<Phase>('discovery')
  const [opStep, setOpStep] = useState<OpStep>(0)

  // Operational answers
  const [budget, setBudget] = useState<DiscoveryInput['budget']>('zero')
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(6)
  const [hasAudience, setHasAudience] = useState<boolean>(false)
  const [audienceSize, setAudienceSize] = useState<number | undefined>(undefined)

  function addMessage(role: 'user' | 'assistant', text: string) {
    setMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, role, text }])
  }

  useEffect(() => {
    const initText = mode === 'post_page' && pageContext
      ? `Sua página para "${pageContext.product}" está pronta. Agora vamos montar o plano de divulgação. Você tem perfis em redes sociais hoje? Me conta quais e quantos seguidores você tem.`
      : 'Oi! Vou te ajudar a montar um plano de divulgação completo. Primeiro me conta: qual é o seu produto e para quem ele é?'
    setMessages([{ id: 'init', role: 'assistant', text: initText }])
  }, [mode, pageContext])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    addMessage('user', text)
    setIsLoading(true)

    const newHistory = [...apiHistory, { role: 'user', content: text }]
    setApiHistory(newHistory)

    try {
      const res = await fetch('/api/agents/growth/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          pageContext: mode === 'post_page' ? pageContext : undefined,
        }),
      })
      if (!res.ok || !res.body) throw new Error('Erro na API')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]' || data === '[ERROR]') break
            try { accumulated += JSON.parse(data) as string } catch { /* partial */ }
          }
        }
      }

      let displayText = accumulated
      let discoveryComplete = false

      try {
        const parsed = JSON.parse(accumulated) as {
          message?: string
          growth_discovery_update?: Record<string, unknown>
          meta?: { growth_discovery_completo?: boolean }
        }

        if (parsed.message) displayText = parsed.message

        if (parsed.growth_discovery_update) {
          setGrowthDiscovery(prev => {
            const next = { ...prev }
            for (const [k, v] of Object.entries(parsed.growth_discovery_update!)) {
              if (v !== null && v !== undefined) next[k] = v
            }
            return next
          })
        }

        if (parsed.meta?.growth_discovery_completo) {
          discoveryComplete = true
        }
      } catch { /* raw text, use accumulated */ }

      addMessage('assistant', displayText)
      setApiHistory(prev => [...prev, { role: 'assistant', content: displayText }])

      if (discoveryComplete) {
        setTimeout(() => {
          addMessage('assistant', OP_QUESTIONS[0])
          setPhase('operational')
        }, 600)
      }
    } catch {
      addMessage('assistant', 'Desculpe, tive um problema técnico. Pode tentar novamente?')
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void sendMessage()
    }
  }

  // Operational handlers
  function handleBudget(label: string, value: DiscoveryInput['budget']) {
    addMessage('user', label)
    setBudget(value)
    setTimeout(() => {
      addMessage('assistant', OP_QUESTIONS[1])
      setOpStep(1)
    }, 300)
  }

  function handleHours(label: string, value: number) {
    addMessage('user', label)
    setHoursPerWeek(value)
    setTimeout(() => {
      addMessage('assistant', OP_QUESTIONS[2])
      setOpStep(2)
    }, 300)
  }

  function handleAudience(label: string, ha: boolean, size?: number) {
    addMessage('user', label)
    setHasAudience(ha)
    setAudienceSize(size)
    setTimeout(() => {
      addMessage('assistant', 'Perfeito! Tenho tudo que preciso para montar sua estratégia.')
      setPhase('ready')
    }, 300)
  }

  function handleGenerate() {
    // Build PageContext: from prop (post_page) or from discovery data (direct)
    const pc: PageContext = pageContext ?? buildPageContextFromDiscovery(growthDiscovery)

    const di: DiscoveryInput = {
      budget,
      hoursPerWeek,
      hasAudience,
      audienceSize,
      hasPostedContent: !!(growthDiscovery.tem_conteudo_ativo),
      mainGoal: (growthDiscovery.objetivo_principal as DiscoveryInput['mainGoal']) ?? 'first_sale',
    }

    const state: GrowthState = {
      pageContext: pc,
      discoveryInput: di,
      currentStep: 'strategy',
      entryMode: mode,
    }
    saveGrowthState(state)
    router.push('/growth/strategy')
  }

  const quickReplyClass =
    'rounded-full border border-[var(--primary)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-fg)] transition-colors'

  return (
    <main className="min-h-screen bg-[var(--bg)] flex flex-col">
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto">

        {/* Header */}
        <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <button
            onClick={() => router.push('/growth')}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← Voltar
          </button>
          <span className="text-sm font-semibold text-[var(--text-primary)]">Discovery</span>
        </div>

        {/* Product context card — post_page only */}
        {mode === 'post_page' && pageContext && (
          <div className="shrink-0 mx-4 mt-3 rounded-xl bg-[var(--surface-elevated)] px-4 py-2.5 text-sm text-[var(--text-secondary)]">
            📦 {pageContext.product} · {pageContext.niche} · {pageContext.ticketLabel}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[var(--primary)] text-[var(--primary-fg)] rounded-br-sm'
                  : 'bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-sm bg-[var(--surface-elevated)] px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-[var(--text-secondary)]"
                      style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)] p-3">
          {phase === 'ready' ? (
            <button
              onClick={handleGenerate}
              className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-[var(--primary-fg)] hover:opacity-90 transition-opacity"
            >
              Gerar minha estratégia →
            </button>
          ) : phase === 'operational' ? (
            <div className="flex flex-wrap gap-2">
              {opStep === 0 && BUDGET_OPTIONS.map((opt) => (
                <button key={opt.label} onClick={() => handleBudget(opt.label, opt.value)} className={quickReplyClass}>
                  {opt.label}
                </button>
              ))}
              {opStep === 1 && HOURS_OPTIONS.map((opt) => (
                <button key={opt.label} onClick={() => handleHours(opt.label, opt.value)} className={quickReplyClass}>
                  {opt.label}
                </button>
              ))}
              {opStep === 2 && AUDIENCE_OPTIONS.map((opt) => (
                <button key={opt.label} onClick={() => handleAudience(opt.label, opt.hasAudience, opt.audienceSize)} className={quickReplyClass}>
                  {opt.label}
                </button>
              ))}
            </div>
          ) : (
            // Discovery phase — text input
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua resposta… (Enter para enviar)"
                rows={1}
                disabled={isLoading}
                className="flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none disabled:opacity-50 transition-colors"
                style={{ maxHeight: '120px', overflowY: 'auto' }}
              />
              <button
                onClick={() => { void sendMessage() }}
                disabled={isLoading || !input.trim()}
                className="shrink-0 rounded-xl bg-[var(--primary)] p-2.5 text-[var(--primary-fg)] hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}

function buildPageContextFromDiscovery(disc: Record<string, unknown>): PageContext {
  const ticketMedio = (disc.ticket_medio as TicketMedio) ?? 'ate-97'
  const ticketInfo = TICKET_MAP[ticketMedio] ?? TICKET_MAP['ate-97']
  return {
    product:     String(disc.produto ?? ''),
    niche:       String(disc.nicho ?? ''),
    ticket:      ticketInfo.ticket,
    ticketLabel: ticketInfo.ticketLabel,
    audience:    String(disc.publico ?? ''),
    objective:   String(disc.meta_faturamento ?? ''),
  }
}
