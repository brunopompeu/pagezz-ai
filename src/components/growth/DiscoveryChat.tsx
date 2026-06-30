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

interface ConversationSummary {
  id: string
  title: string
  createdAt: number
  messageCount: number
}

interface ConvData {
  messages: Message[]
  growthDiscovery: Record<string, unknown>
  apiHistory: { role: string; content: string }[]
  phase: Phase
  opStep: OpStep
  budget: DiscoveryInput['budget']
  hoursPerWeek: number
  hasAudience: boolean
  audienceSize: number | undefined
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
type OpStep = 0 | 1 | 2

const OP_QUESTIONS = [
  'Você tem verba pra investir em anúncios?',
  'Quantas horas por semana você consegue dedicar à divulgação?',
  'Você já tem audiência? (seguidores, lista de e-mail, grupo)',
]

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_HISTORY = 'pagezz_growth_history'
const STORAGE_CURRENT_ID = 'pagezz_growth_current_id'
const convKey = (id: string) => `pagezz_growth_conv_${id}`

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function generateTitle(messages: Message[]): string {
  const first = messages.find((m) => m.role === 'user')
  if (!first) return 'Nova conversa'
  const t = first.text.slice(0, 45)
  return t.length < first.text.length ? t + '…' : t
}

function formatDate(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return 'agora'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}min atrás`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h atrás`
  return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function loadHistory(): ConversationSummary[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_HISTORY) ?? '[]') } catch { return [] }
}
function saveHistory(h: ConversationSummary[]) { localStorage.setItem(STORAGE_HISTORY, JSON.stringify(h)) }

function loadConvData(id: string): ConvData | null {
  try {
    const r = localStorage.getItem(convKey(id))
    if (!r) return null
    return JSON.parse(r) as ConvData
  } catch { return null }
}
function saveConvData(id: string, d: ConvData) { localStorage.setItem(convKey(id), JSON.stringify(d)) }

// ─── Component ────────────────────────────────────────────────────────────────

export function DiscoveryChat({ mode, pageContext }: Props) {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  const initText = mode === 'post_page' && pageContext
    ? `Sua página para "${pageContext.product}" está pronta. Agora vamos montar o plano de divulgação. Você tem perfis em redes sociais hoje? Me conta quais e quantos seguidores você tem.`
    : 'Oi! Vou te ajudar a montar um plano de divulgação completo. Primeiro me conta: qual é o seu produto e para quem ele é?'

  const initialMessage: Message = { id: 'init', role: 'assistant', text: initText }

  // Conversation management
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [history, setHistory] = useState<ConversationSummary[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [confirmNew, setConfirmNew] = useState(false)

  const [messages, setMessages] = useState<Message[]>([initialMessage])
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

  // ── Init ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const savedHistory = loadHistory()
    setHistory(savedHistory)

    const savedId = localStorage.getItem(STORAGE_CURRENT_ID)
    if (savedId) {
      const conv = loadConvData(savedId)
      if (conv && conv.messages.length > 0) {
        setCurrentId(savedId)
        setMessages(conv.messages)
        setGrowthDiscovery(conv.growthDiscovery ?? {})
        setApiHistory(conv.apiHistory ?? [])
        setPhase(conv.phase ?? 'discovery')
        setOpStep((conv.opStep ?? 0) as OpStep)
        setBudget(conv.budget ?? 'zero')
        setHoursPerWeek(conv.hoursPerWeek ?? 6)
        setHasAudience(conv.hasAudience ?? false)
        setAudienceSize(conv.audienceSize)
        return
      }
    }

    createNewConversation(savedHistory)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setShowHistory(false)
      }
    }
    if (showHistory) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [showHistory])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // ── Conversation management ────────────────────────────────────────────────

  function createNewConversation(hist: ConversationSummary[]) {
    const newId = generateId()
    const newSummary: ConversationSummary = {
      id: newId,
      title: 'Nova conversa',
      createdAt: Date.now(),
      messageCount: 0,
    }
    const newHist = [newSummary, ...hist]
    saveConvData(newId, {
      messages: [initialMessage],
      growthDiscovery: {},
      apiHistory: [],
      phase: 'discovery',
      opStep: 0,
      budget: 'zero',
      hoursPerWeek: 6,
      hasAudience: false,
      audienceSize: undefined,
    })
    saveHistory(newHist)
    localStorage.setItem(STORAGE_CURRENT_ID, newId)

    setCurrentId(newId)
    setHistory(newHist)
    setMessages([initialMessage])
    setGrowthDiscovery({})
    setApiHistory([])
    setPhase('discovery')
    setOpStep(0)
    setBudget('zero')
    setHoursPerWeek(6)
    setHasAudience(false)
    setAudienceSize(undefined)
    setInput('')
    setShowHistory(false)
  }

  function handleNewConversation() {
    const hasProgress = messages.some((m) => m.role === 'user')
    if (hasProgress) {
      setConfirmNew(true)
    } else {
      setShowHistory(false)
    }
  }

  function switchConversation(id: string) {
    if (id === currentId) { setShowHistory(false); return }
    const conv = loadConvData(id)
    if (!conv) return
    localStorage.setItem(STORAGE_CURRENT_ID, id)
    setCurrentId(id)
    setMessages(conv.messages.length > 0 ? conv.messages : [initialMessage])
    setGrowthDiscovery(conv.growthDiscovery ?? {})
    setApiHistory(conv.apiHistory ?? [])
    setPhase(conv.phase ?? 'discovery')
    setOpStep((conv.opStep ?? 0) as OpStep)
    setBudget(conv.budget ?? 'zero')
    setHoursPerWeek(conv.hoursPerWeek ?? 6)
    setHasAudience(conv.hasAudience ?? false)
    setAudienceSize(conv.audienceSize)
    setInput('')
    setShowHistory(false)
  }

  function handleDeleteOne(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    localStorage.removeItem(convKey(id))
    const newHist = history.filter((c) => c.id !== id)
    saveHistory(newHist)
    setHistory(newHist)
    if (id === currentId) {
      if (newHist.length > 0) {
        switchConversation(newHist[0].id)
      } else {
        setShowHistory(false)
        createNewConversation([])
      }
    }
  }

  function persistConv(
    id: string,
    msgs: Message[],
    disc: Record<string, unknown>,
    apiHist: { role: string; content: string }[],
    ph: Phase,
    step: OpStep,
    bgt: DiscoveryInput['budget'],
    hrs: number,
    ha: boolean,
    as_: number | undefined,
  ) {
    saveConvData(id, {
      messages: msgs,
      growthDiscovery: disc,
      apiHistory: apiHist,
      phase: ph,
      opStep: step,
      budget: bgt,
      hoursPerWeek: hrs,
      hasAudience: ha,
      audienceSize: as_,
    })
    const currentHist = loadHistory()
    const userCount = msgs.filter((m) => m.role === 'user').length
    const title = generateTitle(msgs)
    const newHist = currentHist.map((h) => (h.id === id ? { ...h, title, messageCount: userCount } : h))
    saveHistory(newHist)
    setHistory(newHist)
  }

  // ── Send message ──────────────────────────────────────────────────────────

  async function sendMessage() {
    const text = input.trim()
    if (!text || isLoading || !currentId) return
    setInput('')

    const userMsg: Message = { id: `${Date.now()}-u`, role: 'user', text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setIsLoading(true)

    const newApiHistory = [...apiHistory, { role: 'user', content: text }]
    setApiHistory(newApiHistory)

    try {
      const res = await fetch('/api/agents/growth/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newApiHistory,
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
      let newDiscovery = growthDiscovery

      try {
        const parsed = JSON.parse(accumulated) as {
          message?: string
          growth_discovery_update?: Record<string, unknown>
          meta?: { growth_discovery_completo?: boolean }
        }

        if (parsed.message) displayText = parsed.message

        if (parsed.growth_discovery_update) {
          newDiscovery = { ...growthDiscovery }
          for (const [k, v] of Object.entries(parsed.growth_discovery_update)) {
            if (v !== null && v !== undefined) newDiscovery[k] = v
          }
          setGrowthDiscovery(newDiscovery)
        }

        if (parsed.meta?.growth_discovery_completo) {
          discoveryComplete = true
        }
      } catch { /* raw text */ }

      const assistantMsg: Message = { id: `${Date.now()}-a`, role: 'assistant', text: displayText }
      const finalMessages = [...nextMessages, assistantMsg]
      setMessages(finalMessages)

      const finalApiHistory = [...newApiHistory, { role: 'assistant', content: displayText }]
      setApiHistory(finalApiHistory)

      persistConv(currentId, finalMessages, newDiscovery, finalApiHistory, phase, opStep, budget, hoursPerWeek, hasAudience, audienceSize)

      if (discoveryComplete) {
        setTimeout(() => {
          const opMsg: Message = { id: `${Date.now()}-op`, role: 'assistant', text: OP_QUESTIONS[0] }
          const opMessages = [...finalMessages, opMsg]
          setMessages(opMessages)
          setPhase('operational')
          persistConv(currentId, opMessages, newDiscovery, finalApiHistory, 'operational', 0, budget, hoursPerWeek, hasAudience, audienceSize)
        }, 600)
      }
    } catch {
      const errMsg: Message = { id: `${Date.now()}-err`, role: 'assistant', text: 'Desculpe, tive um problema técnico. Pode tentar novamente?' }
      setMessages(prev => [...prev, errMsg])
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

  // ── Operational handlers ──────────────────────────────────────────────────

  function handleBudget(label: string, value: DiscoveryInput['budget']) {
    const userMsg: Message = { id: `${Date.now()}-u`, role: 'user', text: label }
    const msgs = [...messages, userMsg]
    setMessages(msgs)
    setBudget(value)
    setTimeout(() => {
      const opMsg: Message = { id: `${Date.now()}-op`, role: 'assistant', text: OP_QUESTIONS[1] }
      const newMsgs = [...msgs, opMsg]
      setMessages(newMsgs)
      setOpStep(1)
      if (currentId) persistConv(currentId, newMsgs, growthDiscovery, apiHistory, 'operational', 1, value, hoursPerWeek, hasAudience, audienceSize)
    }, 300)
  }

  function handleHours(label: string, value: number) {
    const userMsg: Message = { id: `${Date.now()}-u`, role: 'user', text: label }
    const msgs = [...messages, userMsg]
    setMessages(msgs)
    setHoursPerWeek(value)
    setTimeout(() => {
      const opMsg: Message = { id: `${Date.now()}-op`, role: 'assistant', text: OP_QUESTIONS[2] }
      const newMsgs = [...msgs, opMsg]
      setMessages(newMsgs)
      setOpStep(2)
      if (currentId) persistConv(currentId, newMsgs, growthDiscovery, apiHistory, 'operational', 2, budget, value, hasAudience, audienceSize)
    }, 300)
  }

  function handleAudience(label: string, ha: boolean, size?: number) {
    const userMsg: Message = { id: `${Date.now()}-u`, role: 'user', text: label }
    const msgs = [...messages, userMsg]
    setMessages(msgs)
    setHasAudience(ha)
    setAudienceSize(size)
    setTimeout(() => {
      const doneMsg: Message = { id: `${Date.now()}-done`, role: 'assistant', text: 'Perfeito! Tenho tudo que preciso para montar sua estratégia.' }
      const newMsgs = [...msgs, doneMsg]
      setMessages(newMsgs)
      setPhase('ready')
      if (currentId) persistConv(currentId, newMsgs, growthDiscovery, apiHistory, 'ready', opStep, budget, hoursPerWeek, ha, size)
    }, 300)
  }

  function handleGenerate() {
    const pc: PageContext = pageContext ?? buildPageContextFromDiscovery(growthDiscovery)
    const di: DiscoveryInput = {
      budget,
      hoursPerWeek,
      hasAudience,
      audienceSize,
      hasPostedContent: !!(growthDiscovery.tem_conteudo_ativo),
      mainGoal: (growthDiscovery.mainGoal as DiscoveryInput['mainGoal']) ?? 'first_sale',
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

  // Show early "Ir para a estratégia" once 3+ user exchanges and some discovery data collected
  const userMessageCount = messages.filter((m) => m.role === 'user').length
  const canProceedEarly = phase === 'discovery' && userMessageCount >= 3 && Object.keys(growthDiscovery).length > 0

  const quickReplyClass =
    'rounded-full border border-[var(--primary)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-fg)] transition-colors'

  return (
    <main className="min-h-screen bg-[var(--bg)] flex flex-col">

      {/* Confirmation dialog */}
      {confirmNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-80 rounded-2xl bg-[var(--surface-elevated)] p-6 shadow-2xl border border-[var(--border)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Iniciar nova conversa?</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              A conversa atual fica salva no histórico e você pode retomá-la a qualquer momento.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmNew(false)}
                className="flex-1 rounded-xl border border-[var(--border)] py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setConfirmNew(false); createNewConversation(loadHistory()) }}
                className="flex-1 rounded-xl bg-[var(--primary)] py-2 text-sm font-semibold text-[var(--primary-fg)] hover:opacity-90 transition-opacity"
              >
                Nova conversa
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto">

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← Voltar
            </button>
            <span className="text-sm font-semibold text-[var(--text-primary)]">Discovery</span>
          </div>

          <div className="flex items-center gap-2">
            {/* History dropdown */}
            <div ref={historyRef} className="relative">
              <button
                onClick={() => setShowHistory((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <polyline points="23 20 23 14 17 14"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
                Histórico
                {history.length > 0 && (
                  <span className="rounded-full bg-[var(--surface-elevated)] px-1.5 text-[10px] font-medium">
                    {history.length}
                  </span>
                )}
              </button>

              {showHistory && (
                <div className="absolute right-0 top-full z-40 mt-1 w-72 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl overflow-hidden">
                  <div className="max-h-72 overflow-y-auto">
                    {history.length === 0 ? (
                      <p className="px-4 py-6 text-center text-xs text-[var(--text-secondary)]">Nenhuma conversa anterior</p>
                    ) : (
                      history.map((conv) => (
                        <div
                          key={conv.id}
                          className={`group flex items-center gap-1 transition-colors hover:bg-[var(--surface)] ${
                            conv.id === currentId ? 'bg-[var(--surface)] border-l-2 border-[var(--primary)]' : ''
                          }`}
                        >
                          <button
                            onClick={() => switchConversation(conv.id)}
                            className="flex min-w-0 flex-1 flex-col gap-0.5 px-4 py-3 text-left"
                          >
                            <span className="truncate text-xs font-medium text-[var(--text-primary)]">{conv.title}</span>
                            <span className="text-[10px] text-[var(--text-secondary)]">
                              {conv.messageCount} {conv.messageCount === 1 ? 'mensagem' : 'mensagens'} · {formatDate(conv.createdAt)}
                            </span>
                          </button>
                          <button
                            onClick={(e) => handleDeleteOne(conv.id, e)}
                            title="Apagar conversa"
                            className="mr-2 shrink-0 rounded-md p-1.5 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 hover:bg-[var(--border)] hover:text-red-400 transition-all"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              <path d="M10 11v6"/><path d="M14 11v6"/>
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* New conversation button */}
            <button
              onClick={handleNewConversation}
              title="Nova conversa"
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Novo
            </button>
          </div>
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
        <div className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)] p-3 space-y-2">

          {/* Early strategy CTA — appears after 3+ exchanges with enough discovery data */}
          {canProceedEarly && (
            <button
              onClick={handleGenerate}
              className="w-full rounded-xl border border-[var(--primary)] py-2 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-fg)] transition-colors"
            >
              Ir para a estratégia →
            </button>
          )}

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
