'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { buildPage } from '@/lib/templates/buildPage'
import { selectTemplate } from '@/lib/templates/selectTemplate'
import { injectWidgets, applyHeroImage } from '@/lib/templates/injectWidgets'
import type { PageData, ThemeName, StructureName } from '@/lib/templates/types'
import type { BriefingField } from '@/lib/agents/briefingOrchestrator'
import { GrowthEntryButton } from '@/components/growth/GrowthEntryButton'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  rawJson?: string
}

interface Design {
  primary: string
  background: string
  text: string
}

interface Briefing {
  negocio?: {
    produto?: string
    nicho?: string
    ticket_medio?: 'ate-97' | '97-297' | '297-997' | 'acima-997'
    url_atual?: string
  }
  publico?: {
    perfil?: string
    situacao_atual?: string
    desejo?: string
    tentativas_anteriores?: string[]
    maior_objecao?: string
  }
  oferta?: {
    entregaveis?: Array<{ nome: string; formato: string; descricao: string }>
    bonus?: Array<{ nome: string; valor_percebido: string; descricao: string }>
    garantia?: { dias: number; descricao: string }
    preco_avista?: number
    preco_parcelado?: string
    mecanismo_unico?: string
  }
  provas?: {
    depoimentos?: Array<{ nome: string; resultado: string; texto: string; tem_print: boolean }>
    resultados_proprios?: string
    autoridade?: string
    midias?: string[]
  }
  mercado?: {
    posicionamento?: string
    concorrentes_principais?: string[]
    diferencial?: string
    momento_mercado?: string
  }
  analise_produto?: {
    promessa_central?: string
    para_quem_e?: string[]
    para_quem_nao_e?: string[]
    mecanismo_explicado?: string
  }
  estrategia_pagina?: {
    tipo_pagina?: string
    elementos_conversao?: string[]
    copy_strategy?: {
      promessa_central?: string
      arco_emocional?: string
      objecoes_principais?: string[]
    }
  }
  meta?: {
    discovery_completo?: boolean
    market_completo?: boolean
    product_completo?: boolean
    pronto_para_geracao?: boolean
  }
  materiais?: Record<string, string>
}

interface AiResponse {
  message: string
  briefing_update: Partial<Briefing> | null
}

interface ConversationSummary {
  id: string
  title: string
  createdAt: number
  messageCount: number
}

interface ConversationData {
  messages: Message[]
  briefing: Partial<Briefing>
  design: Design
  isCustomDesign?: boolean
  strategy?: Strategy | null
}

interface CopyStrategyResult {
  promessa_central: string
  arco_emocional: string
  objecoes_principais: string[]
  mecanismo_apresentacao: string
  tom_comunicacao: string
}
interface PageTypeOption {
  tipo: string
  tradeoff: string
}
interface ConversionElementResult {
  elemento: string
  motivo: string
}
interface PageTypeRecommendationResult {
  tipo_recomendado: string
  justificativa: string
  alternativas: PageTypeOption[]
  elementos_conversao: ConversionElementResult[]
}
interface Strategy {
  copyStrategy: CopyStrategyResult
  pageTypeRecommendation: PageTypeRecommendationResult
}
type StrategyStatus = 'idle' | 'running' | 'done' | 'error' | 'confirmed'

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_DESIGN: Design = { primary: '#FFC200', background: '#0A0B14', text: '#F5F5F7' }

const DEFAULT_PAGE_BASE: PageData = {
  nomeProduto: '',
  nicho: '',
  ticket_medio: 'ate-97',
  publico: '',
  objetivo: 'venda',
  headline: '',
  subheadline: '',
  textoCta: 'Quero Começar Agora',
  theme: 'dark-energy',
  structure: 'low-ticket',
  heroStyle: 'a',
}

const INITIAL_MESSAGE: Message = {
  id: '__init__',
  role: 'assistant',
  text: 'Olá! Sou o Pagezz.AI — seu estrategista de conversão. 🎯\n\nVou construir sua página de venda enquanto conversamos. Não precisa preencher formulários.\n\nMe conta: o que você vende?',
}

const STORAGE_HISTORY = 'pagezz_chat_history'
const STORAGE_CURRENT_ID = 'pagezz_chat_current_id'
const convKey = (id: string) => `pagezz_chat_conv_${id}`

// ─── Storage helpers ──────────────────────────────────────────────────────────

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

function loadConvData(id: string): ConversationData | null {
  try {
    const r = localStorage.getItem(convKey(id))
    if (!r) return null
    const d = JSON.parse(r) as ConversationData & { pageData?: Record<string, unknown>; sections?: Record<string, string> }
    if (!d.briefing) {
      d.briefing = d.pageData
        ? { negocio: { produto: d.pageData.nomeProduto as string | undefined, nicho: d.pageData.nicho as string | undefined } }
        : {}
    }
    return d as ConversationData
  } catch { return null }
}
function saveConvData(id: string, d: ConversationData) { localStorage.setItem(convKey(id), JSON.stringify(d)) }

// ─── Briefing → PageData mapper ───────────────────────────────────────────────

function briefingToPageData(b: Partial<Briefing>): Partial<PageData> {
  return {
    nomeProduto: b.negocio?.produto,
    nicho: b.negocio?.nicho,
    ticket_medio: b.negocio?.ticket_medio,
    publico: b.publico?.perfil,
    headline: b.analise_produto?.promessa_central,
  }
}

// ─── Page builder ─────────────────────────────────────────────────────────────

function buildPreviewHtml(partialData: Partial<PageData>, customDesign: Design | null): string {
  const hasContent = Boolean(partialData.headline || partialData.nomeProduto)

  if (!hasContent) {
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0A0B14;color:#F5F5F7;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}.p{text-align:center;opacity:.3}.p p{font-size:14px;margin-top:8px}</style>
</head><body><div class="p"><div style="font-size:48px">📄</div><p>Sua página aparecerá aqui conforme a conversa avança</p></div></body></html>`
  }

  const validStructures: StructureName[] = ['low-ticket', 'authority', 'qualification']
  const structure: StructureName = validStructures.includes(partialData.structure as StructureName)
    ? (partialData.structure as StructureName)
    : 'low-ticket'
  const derivedTheme = partialData.nicho
    ? selectTemplate('ate-97', partialData.nicho).theme
    : 'dark-energy'
  const theme: ThemeName = partialData.theme ?? derivedTheme

  const data: PageData = {
    ...DEFAULT_PAGE_BASE,
    ...partialData,
    structure,
    theme,
    heroStyle: partialData.heroStyle ?? 'a',
  }

  let html = buildPage(data)

  // Strip unresolved template tokens (gaps in partial data)
  html = html.replace(/\{\{[A-Z_0-9]+\}\}/g, '')

  if (customDesign) {
    const override = `<style>
:root {
  --primary: ${customDesign.primary};
  --primary-dk: ${customDesign.primary};
  --bg: ${customDesign.background};
  --bg-alt: ${customDesign.background};
  --bg-dark: ${customDesign.background};
  --text: ${customDesign.text};
  --text-2: ${customDesign.text}99;
  --text-inv: ${customDesign.background};
}
body { background: ${customDesign.background}; }
</style>`
    html = html.replace('</head>', `${override}\n</head>`)
  }

  return html
}

// ─── AI response parser (robust) ──────────────────────────────────────────────

function parseAiResponse(raw: string): AiResponse | null {
  let s = raw.trim()

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  if (s.startsWith('```')) {
    s = s.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim()
  }

  // Try direct parse
  try {
    const obj = JSON.parse(s)
    if (obj && typeof obj.message === 'string') return obj as AiResponse
  } catch {/* continue */}

  // Try extracting outermost JSON object
  const objMatch = s.match(/\{[\s\S]*\}/)
  if (objMatch) {
    try {
      const obj = JSON.parse(objMatch[0])
      if (obj && typeof obj.message === 'string') return obj as AiResponse
    } catch {/* continue */}
  }

  // Last resort: regex-extract the message field
  const msgMatch = s.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/)
  if (msgMatch) {
    return {
      message: msgMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\'),
      briefing_update: null,
    }
  }

  return null
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const router = useRouter()

  const [currentId, setCurrentId] = useState<string | null>(null)
  const [history, setHistory] = useState<ConversationSummary[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [confirmNew, setConfirmNew] = useState(false)

  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [briefing, setBriefing] = useState<Partial<Briefing>>({})
  const [design, setDesign] = useState<Design>(DEFAULT_DESIGN)
  const [isCustomDesign, setIsCustomDesign] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'chat' | 'pipeline'>('pipeline')
  const [strategyStatus, setStrategyStatus] = useState<StrategyStatus>('idle')
  const [strategy, setStrategy] = useState<Strategy | null>(null)
  const [selectedPageType, setSelectedPageType] = useState<string>('')
  const [selectedElements, setSelectedElements] = useState<Set<string>>(new Set())
  const [briefingFields, setBriefingFields] = useState<BriefingField[] | null>(null)
  const [briefingFieldsStatus, setBriefingFieldsStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [briefingValues, setBriefingValues] = useState<Record<string, string>>({})
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'writing' | 'assembling' | 'done' | 'error'>('idle')
  const [pageHtmlRaw, setPageHtmlRaw] = useState<string | null>(null)
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null)
  const [refineInstruction, setRefineInstruction] = useState('')
  const [refineStatus, setRefineStatus] = useState<'idle' | 'running' | 'error'>('idle')
  const briefingOrchestratorTriggered = useRef(false)
  const strategyTriggered = useRef(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  // ── Init ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const savedHistory = loadHistory()
    setHistory(savedHistory)

    const savedId = localStorage.getItem(STORAGE_CURRENT_ID)
    if (savedId) {
      const conv = loadConvData(savedId)
      if (conv) {
        setCurrentId(savedId)
        setMessages(conv.messages.length > 0 ? conv.messages : [INITIAL_MESSAGE])
        setBriefing(conv.briefing ?? {})
        setDesign(conv.design)
        setIsCustomDesign(conv.isCustomDesign ?? false)
        return
      }
    }

    createNewConversation(savedHistory)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close history dropdown on outside click
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

  function runStrategy(convId: string | null, currentBriefing: Partial<Briefing>) {
    setStrategyStatus('running')
    const postJson = async (url: string) => {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefing: currentBriefing }),
      })
      const data = await r.json().catch(() => null)
      if (!r.ok || !data || data.error) {
        throw new Error(`${url}: ${data?.error ?? `HTTP ${r.status}`}`)
      }
      return data
    }
    Promise.all([
      postJson('/api/agents/strategy/copy'),
      postJson('/api/agents/strategy/page-type'),
    ])
      .then(([copyStrategy, pageTypeRecommendation]) => {
        if (!pageTypeRecommendation?.tipo_recomendado) {
          throw new Error('page-type sem tipo_recomendado')
        }
        pageTypeRecommendation.alternativas = pageTypeRecommendation.alternativas ?? []
        pageTypeRecommendation.elementos_conversao = pageTypeRecommendation.elementos_conversao ?? []
        const computed: Strategy = { copyStrategy, pageTypeRecommendation }
        setStrategy(computed)
        setStrategyStatus('done')
        if (convId) {
          const existing = loadConvData(convId)
          if (existing) saveConvData(convId, { ...existing, strategy: computed })
        }
      })
      .catch((err) => {
        console.error('[strategy]', err)
        setStrategyStatus('error')
      })
  }

  useEffect(() => {
    if (!briefing.meta?.discovery_completo || strategyTriggered.current) return
    strategyTriggered.current = true
    setViewMode('pipeline')
    runStrategy(currentId, briefing)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [briefing, briefing.meta?.discovery_completo])

  useEffect(() => {
    if (!strategy) return
    setSelectedPageType(strategy.pageTypeRecommendation.tipo_recomendado)
    setSelectedElements(new Set(strategy.pageTypeRecommendation.elementos_conversao.map((e) => e.elemento)))
  }, [strategy])

  useEffect(() => {
    if (strategyStatus !== 'confirmed' || briefingOrchestratorTriggered.current) return
    briefingOrchestratorTriggered.current = true
    setBriefingFieldsStatus('loading')

    fetch('/api/agents/briefing/orchestrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        briefing,
        tipoPagina: briefing.estrategia_pagina?.tipo_pagina ?? '',
        elementosConversao: briefing.estrategia_pagina?.elementos_conversao ?? [],
      }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => null)
        if (!r.ok || !Array.isArray(data)) {
          throw new Error(`orchestrate: ${data?.error ?? `HTTP ${r.status}`}`)
        }
        setBriefingFields(data as BriefingField[])
        setBriefingFieldsStatus('ready')
      })
      .catch((err) => {
        console.error('[briefingOrchestrator]', err)
        setBriefingFields(null)
        setBriefingFieldsStatus('error')
      })
  }, [strategyStatus, briefing])

  useEffect(() => {
    if (!briefingFields) return
    const initial: Record<string, string> = {}
    for (const f of briefingFields) {
      initial[f.key] = f.placeholder
    }
    setBriefingValues(initial)
  }, [briefingFields])

  // ── Conversation management ────────────────────────────────────────────────

  // Zera todo o estado do pipeline (estratégia, briefing room, geração, refino)
  // para que o chatView volte a 'chat'. Sem isso, criar/trocar de conversa deixa
  // a view presa na tela de estratégia/preview anterior.
  function resetPipeline() {
    setStrategyStatus('idle')
    setStrategy(null)
    setSelectedPageType('')
    setSelectedElements(new Set())
    setBriefingFields(null)
    setBriefingFieldsStatus('idle')
    setBriefingValues({})
    setGenerationStatus('idle')
    setPageHtmlRaw(null)
    setGeneratedHtml(null)
    setRefineInstruction('')
    setRefineStatus('idle')
    setIsLoading(false)
    strategyTriggered.current = false
    briefingOrchestratorTriggered.current = false
  }

  function createNewConversation(hist: ConversationSummary[]) {
    const newId = generateId()
    const newSummary: ConversationSummary = {
      id: newId,
      title: 'Nova conversa',
      createdAt: Date.now(),
      messageCount: 0,
    }
    const newHist = [newSummary, ...hist]
    saveConvData(newId, { messages: [INITIAL_MESSAGE], briefing: {}, design: DEFAULT_DESIGN, isCustomDesign: false })
    saveHistory(newHist)
    localStorage.setItem(STORAGE_CURRENT_ID, newId)

    setCurrentId(newId)
    setHistory(newHist)
    setMessages([INITIAL_MESSAGE])
    setBriefing({})
    setDesign(DEFAULT_DESIGN)
    setIsCustomDesign(false)
    setShowHistory(false)
    resetPipeline()
    setViewMode('pipeline')
  }

  function handleNewConversation() {
    const hasProgress = messages.some((m) => m.role === 'user')
    if (hasProgress) {
      setConfirmNew(true)
    } else {
      // Já estamos numa conversa nova e vazia — não cria outra duplicada,
      // apenas garante que a view volte ao chat.
      resetPipeline()
      setShowHistory(false)
    }
  }

  function switchConversation(id: string) {
    if (id === currentId) { setShowHistory(false); return }
    const conv = loadConvData(id)
    if (!conv) return
    localStorage.setItem(STORAGE_CURRENT_ID, id)
    setCurrentId(id)
    setMessages(conv.messages.length > 0 ? conv.messages : [INITIAL_MESSAGE])
    setBriefing(conv.briefing ?? {})
    setDesign(conv.design)
    setIsCustomDesign(conv.isCustomDesign ?? false)
    setShowHistory(false)
    resetPipeline()
    // Always restore to chat view when switching conversations.
    // Prevent the strategy useEffect from re-running for loaded conversations.
    setViewMode('chat')
    strategyTriggered.current = true
    if (conv.strategy) {
      setStrategy(conv.strategy)
      setStrategyStatus('done')
      setSelectedPageType(conv.strategy.pageTypeRecommendation.tipo_recomendado)
      setSelectedElements(new Set(conv.strategy.pageTypeRecommendation.elementos_conversao.map((e) => e.elemento)))
    }
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

  function handleClearAll() {
    const ok = window.confirm(
      'Apagar TODAS as conversas? Esta ação é irreversível — não há backup.',
    )
    if (!ok) return
    loadHistory().forEach((c) => localStorage.removeItem(convKey(c.id)))
    localStorage.removeItem(STORAGE_HISTORY)
    localStorage.removeItem(STORAGE_CURRENT_ID)
    setShowHistory(false)
    createNewConversation([])
  }

  function persistAfterMessage(
    id: string,
    msgs: Message[],
    br: Partial<Briefing>,
    des: Design,
    isCustDes: boolean,
  ) {
    saveConvData(id, { messages: msgs, briefing: br, design: des, isCustomDesign: isCustDes })
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

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setIsLoading(true)

    try {
      const apiHistory = nextMessages
        .filter((m) => m.id !== '__init__')
        .map((m) => ({ role: m.role, content: m.rawJson ?? m.text }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiHistory }),
      })

      if (!res.ok || !res.body) throw new Error('Erro na resposta da API')

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
            try { accumulated += JSON.parse(data) as string } catch {/* ignore partial chunks */}
          }
        }
      }

      const parsed = parseAiResponse(accumulated)
      const displayText = parsed?.message ?? 'Não consegui processar a resposta. Pode repetir?'

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: displayText,
        rawJson: accumulated,
      }

      const finalMessages = [...nextMessages, assistantMsg]
      setMessages(finalMessages)

      let newBriefing = briefing

      if (parsed?.briefing_update) {
        const update = parsed.briefing_update as Record<string, unknown>
        const current = briefing as Record<string, unknown>
        const merged: Record<string, unknown> = { ...current }
        for (const [key, val] of Object.entries(update)) {
          if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
            merged[key] = { ...(current[key] as object ?? {}), ...(val as object) }
          } else {
            merged[key] = val
          }
        }
        newBriefing = merged as Partial<Briefing>
        setBriefing(newBriefing)
      }

      persistAfterMessage(currentId, finalMessages, newBriefing, design, isCustomDesign)
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: 'Ocorreu um erro. Tente novamente.',
        },
      ])
      console.error('[chat]', err)
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function handleCopyHtml() {
    const html = buildPreviewHtml(briefingToPageData(briefing), isCustomDesign ? design : null)
    navigator.clipboard.writeText(html)
  }

  function handleConfirmStrategy() {
    if (!strategy || !currentId) return
    const updatedBriefing: Partial<Briefing> = {
      ...briefing,
      estrategia_pagina: {
        tipo_pagina: selectedPageType,
        elementos_conversao: Array.from(selectedElements),
        copy_strategy: {
          promessa_central: strategy.copyStrategy.promessa_central,
          arco_emocional: strategy.copyStrategy.arco_emocional,
          objecoes_principais: strategy.copyStrategy.objecoes_principais,
        },
      },
    }
    setBriefing(updatedBriefing)
    persistAfterMessage(currentId, messages, updatedBriefing, design, isCustomDesign)
    setStrategyStatus('confirmed')
  }

  async function handleGeneratePage() {
    if (!currentId) return

    const elementosConversao = [...selectedElements]
    const updatedBriefing: Partial<Briefing> = {
      ...briefing,
      materiais: briefingValues,
      estrategia_pagina: {
        ...briefing.estrategia_pagina,
        tipo_pagina: selectedPageType,
        elementos_conversao: elementosConversao,
      },
      meta: { ...briefing.meta, pronto_para_geracao: true },
    }
    setBriefing(updatedBriefing)
    persistAfterMessage(currentId, messages, updatedBriefing, design, isCustomDesign)

    const heroImg = briefingValues.hero_imagem || ''
    const { hero_imagem: _omit, ...materiaisSemImg } = briefingValues
    void _omit

    setGenerationStatus('writing')
    try {
      const res = await fetch('/api/agents/generation/write-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefing: updatedBriefing,
          materiais: materiaisSemImg,
          copyStrategy: updatedBriefing.estrategia_pagina?.copy_strategy ?? {},
          tipoPagina: selectedPageType,
          elementosConversao,
          temHeroImagem: Boolean(heroImg),
        }),
      })
      if (!res.ok) throw new Error('Erro na geração da página')
      const { html } = (await res.json()) as { html: string }
      setGenerationStatus('assembling')
      setPageHtmlRaw(html)
      setGeneratedHtml(applyHeroImage(injectWidgets(html, elementosConversao, materiaisSemImg), heroImg))
      setGenerationStatus('done')
    } catch (err) {
      console.error(err)
      setGenerationStatus('error')
    }
  }

  function handleDownloadHtml() {
    if (!generatedHtml) return
    const slug = (briefing.negocio?.produto ?? 'pagina')
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'pagina'
    const blob = new Blob([generatedHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleRefine() {
    if (!pageHtmlRaw || !refineInstruction.trim() || refineStatus === 'running') return
    setRefineStatus('running')
    try {
      const res = await fetch('/api/agents/generation/refine-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: pageHtmlRaw, instrucao: refineInstruction }),
      })
      if (!res.ok) throw new Error('Erro no refino')
      const { html } = (await res.json()) as { html: string }
      setPageHtmlRaw(html)
      setGeneratedHtml(applyHeroImage(injectWidgets(html, [...selectedElements], briefingValues), briefingValues.hero_imagem || ''))
      setRefineInstruction('')
      setRefineStatus('idle')
    } catch (err) {
      console.error(err)
      setRefineStatus('error')
    }
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const isFinished = Boolean(briefing.analise_produto?.promessa_central)

  const chatView: 'chat' | 'strategy-loading' | 'strategy-ready' | 'strategy-error' | 'briefing-room' | 'generating' | 'preview' =
    viewMode === 'chat'
      ? 'chat'
      : generatedHtml
      ? 'preview'
      : generationStatus !== 'idle'
      ? 'generating'
      : strategyStatus === 'running' ? 'strategy-loading'
      : strategyStatus === 'error' ? 'strategy-error'
      : strategyStatus === 'done' && strategy ? 'strategy-ready'
      : strategyStatus === 'confirmed' ? 'briefing-room'
      : 'chat'

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ height: 'calc(100vh - 56px)' }} className="flex flex-col overflow-hidden">

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

      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← Voltar
          </button>

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
              <div className="absolute left-0 top-full z-40 mt-1 w-72 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl overflow-hidden">
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
                          className="mr-2 shrink-0 rounded p-1 text-[var(--text-secondary)] opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
                {history.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="w-full border-t border-[var(--border)] px-4 py-3 text-left text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    🗑 Apagar todas as conversas
                  </button>
                )}
              </div>
            )}
          </div>

          <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
            Modo Conversa
          </span>
        </div>

        <div className="flex gap-2">
          {isFinished && (
            <button
              onClick={handleCopyHtml}
              className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-fg)] hover:opacity-90 transition-opacity"
            >
              Copiar HTML
            </button>
          )}
          <button
            onClick={handleNewConversation}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            + Nova conversa
          </button>
        </div>
      </div>

      {/* Split screen */}
      <div className="flex flex-1 overflow-hidden">

        {/* Chat view */}
        {chatView === 'chat' && (
          <>
            {/* Left: Chat */}
            <div className="flex w-full flex-col">
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-[var(--primary)] text-[var(--primary-fg)] rounded-br-sm'
                          : 'bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-bl-sm'
                      }`}
                    >
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

              {/* CTA banner: discovery done */}
              {briefing.meta?.discovery_completo && (
                <div className="shrink-0 mx-4 mb-3 flex items-center justify-between gap-3 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/8 px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">Discovery concluído</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      {strategy ? 'A estratégia da sua página já foi gerada' : 'Gere a estratégia para continuar'}
                    </p>
                  </div>
                  {strategy ? (
                    <button
                      onClick={() => setViewMode('pipeline')}
                      className="shrink-0 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-fg)] hover:opacity-90 transition-opacity"
                    >
                      Ver estratégia →
                    </button>
                  ) : (
                    <button
                      onClick={() => { setViewMode('pipeline'); strategyTriggered.current = false; runStrategy(currentId, briefing) }}
                      className="shrink-0 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-fg)] hover:opacity-90 transition-opacity"
                    >
                      Gerar estratégia →
                    </button>
                  )}
                </div>
              )}

              {/* Input */}
              <div className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)] p-3">
                <div className="flex gap-2 items-end">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua mensagem… (Enter para enviar)"
                    rows={1}
                    disabled={isLoading}
                    className="flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none disabled:opacity-50 transition-colors"
                    style={{ maxHeight: '120px', overflowY: 'auto' }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="shrink-0 rounded-xl bg-[var(--primary)] p-2.5 text-[var(--primary-fg)] hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </div>
                <p className="mt-1.5 text-center text-[10px] text-[var(--text-secondary)]">
                  Enter para enviar · Shift+Enter para nova linha
                </p>
              </div>
            </div>
          </>
        )}

        {/* Strategy loading view */}
        {chatView === 'strategy-loading' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-2">Discovery concluído</p>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Definindo a estratégia da sua página…</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">Dois agentes analisando seu briefing em paralelo</p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-4 flex items-center gap-4">
                <div className="text-2xl">🧠</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)]">Estrategista de Copy</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Promessa central, arco emocional, objeções</p>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]"
                      style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-4 flex items-center gap-4">
                <div className="text-2xl">📐</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)]">Arquiteto de Página</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Tipo de página, estrutura e elementos de conversão</p>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]"
                      style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2 + 0.4}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {chatView === 'strategy-error' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <div className="text-3xl">⚠️</div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Não consegui montar a estratégia</h2>
              <p className="mt-2 max-w-sm text-sm text-[var(--text-secondary)]">
                Os agentes de IA podem estar sem cota ou sobrecarregados. Tente de novo em instantes.
              </p>
            </div>
            <button
              onClick={() => { strategyTriggered.current = false; setStrategy(null); setStrategyStatus('idle') }}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-fg)] hover:opacity-90 transition-opacity"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {chatView === 'strategy-ready' && strategy && (
          <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8">
            <div className="mx-auto w-full max-w-xl space-y-6">

              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-1">Estratégia definida</p>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">Tipo de página recomendado</h2>
                </div>
                <button
                  onClick={() => setViewMode('chat')}
                  className="shrink-0 mt-1 flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  Ver chat
                </button>
              </div>

              {/* Tipo recomendado */}
              <div className="rounded-2xl border-2 border-[var(--primary)] bg-[var(--surface-elevated)] px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">Recomendado</span>
                    <p className="mt-1 text-base font-semibold text-[var(--text-primary)] capitalize">
                      {(strategy.pageTypeRecommendation.tipo_recomendado ?? '').replace(/-/g, ' ')}
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                      {strategy.pageTypeRecommendation.justificativa}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-full bg-[var(--primary)] p-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-fg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Alternativas */}
              {strategy.pageTypeRecommendation.alternativas.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Alternativas</p>
                  {strategy.pageTypeRecommendation.alternativas.map((alt) => (
                    <button
                      key={alt.tipo}
                      onClick={() => setSelectedPageType(alt.tipo)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                        selectedPageType === alt.tipo
                          ? 'border-[var(--primary)] bg-[var(--surface-elevated)]'
                          : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-secondary)]'
                      }`}
                    >
                      <p className="text-sm font-medium text-[var(--text-primary)] capitalize">
                        {(alt.tipo ?? '').replace(/-/g, ' ')}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{alt.tradeoff}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Elementos de conversão */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Elementos de conversão</p>
                <p className="text-xs text-[var(--text-secondary)]">Desmarque os que não quiser incluir</p>
                {strategy.pageTypeRecommendation.elementos_conversao.map((el) => {
                  const checked = selectedElements.has(el.elemento)
                  return (
                    <button
                      key={el.elemento}
                      onClick={() => {
                        const next = new Set(selectedElements)
                        if (checked) next.delete(el.elemento)
                        else next.add(el.elemento)
                        setSelectedElements(next)
                      }}
                      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                        checked
                          ? 'border-[var(--border)] bg-[var(--surface-elevated)]'
                          : 'border-[var(--border)] bg-[var(--surface)] opacity-50'
                      }`}
                    >
                      <div className={`mt-0.5 shrink-0 h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                        checked ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-[var(--border)]'
                      }`}>
                        {checked && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--primary-fg)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)] capitalize">
                          {(el.elemento ?? '').replace(/-/g, ' ')}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{el.motivo}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* CTA */}
              <button
                onClick={handleConfirmStrategy}
                className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-semibold text-[var(--primary-fg)] hover:opacity-90 transition-opacity"
              >
                Avançar para coleta de materiais →
              </button>

            </div>
          </div>
        )}

        {chatView === 'briefing-room' && (
          <div className="flex flex-1 items-center justify-center flex-col gap-3 px-6">
            {briefingFieldsStatus === 'loading' && (
              <>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]"
                      style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
                <p className="text-sm text-[var(--text-secondary)]">Preparando seu formulário de materiais…</p>
              </>
            )}

            {briefingFieldsStatus === 'error' && (
              <>
                <p className="text-sm text-[var(--text-primary)]">Erro ao carregar formulário</p>
                <button
                  onClick={() => {
                    briefingOrchestratorTriggered.current = false
                    setBriefingFieldsStatus('idle')
                  }}
                  className="text-xs text-[var(--primary)] underline"
                >
                  Tentar novamente
                </button>
              </>
            )}

            {briefingFieldsStatus === 'ready' && briefingFields && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="shrink-0 border-b border-[var(--border)] px-6 py-3">
                  <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">Briefing Room</p>
                  <h2 className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                    Preencha o que tiver — campos em branco usam sugestões automáticas
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                  {briefingFields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-[var(--text-primary)]">{field.label}</label>
                        {!field.obrigatorio && (
                          <span className="text-[10px] text-[var(--text-secondary)] border border-[var(--border)] rounded px-1.5 py-0.5">opcional</span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{field.descricao}</p>
                      {field.type === 'image' ? (
                        <div>
                          {briefingValues[field.key] ? (
                            <div className="flex items-center gap-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={briefingValues[field.key]}
                                alt="preview"
                                className="h-16 w-16 rounded-lg object-cover border border-[var(--border)]"
                              />
                              <button
                                type="button"
                                onClick={() => setBriefingValues((v) => ({ ...v, [field.key]: '' }))}
                                className="text-xs text-[var(--text-secondary)] underline"
                              >
                                Remover
                              </button>
                            </div>
                          ) : (
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                const reader = new FileReader()
                                reader.onload = () =>
                                  setBriefingValues((v) => ({ ...v, [field.key]: String(reader.result) }))
                                reader.readAsDataURL(file)
                              }}
                              className="block w-full text-sm text-[var(--text-secondary)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--primary-fg)]"
                            />
                          )}
                        </div>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          value={briefingValues[field.key] ?? ''}
                          onChange={(e) => setBriefingValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                        />
                      ) : (
                        <input
                          type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'}
                          value={briefingValues[field.key] ?? ''}
                          onChange={(e) => setBriefingValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="shrink-0 border-t border-[var(--border)] px-6 py-4">
                  <button
                    onClick={handleGeneratePage}
                    className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-semibold text-[var(--primary-fg)] hover:opacity-90 transition-opacity"
                  >
                    ⚡ Gerar minha página
                  </button>
                  <p className="mt-2 text-center text-[10px] text-[var(--text-secondary)]">
                    Campos não preenchidos usam sugestões automáticas
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {chatView === 'generating' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-sm space-y-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)] text-center mb-8">
                Gerando sua página...
              </h2>

              {[
                {
                  label: 'Escrevendo copy',
                  emoji: '✍️',
                  active: generationStatus === 'writing',
                  done: generationStatus === 'assembling' || generationStatus === 'done',
                },
                {
                  label: 'Montando página',
                  emoji: '🔨',
                  active: generationStatus === 'assembling',
                  done: generationStatus === 'done',
                },
              ].map((step) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-3 rounded-xl px-5 py-4 border transition-all ${
                    step.active
                      ? 'border-[#FFC200]/40 bg-[#FFC200]/5'
                      : step.done
                      ? 'border-green-500/30 bg-green-500/5'
                      : 'border-white/10 bg-white/5 opacity-40'
                  }`}
                >
                  <span className="text-xl">
                    {step.done ? '✅' : step.active ? step.emoji : '⏳'}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      step.done ? 'text-green-400' : step.active ? 'text-[#FFC200]' : 'text-white/40'
                    }`}
                  >
                    {step.label}
                    {step.active && (
                      <span className="ml-1 inline-block animate-pulse">...</span>
                    )}
                  </span>
                </div>
              ))}

              {generationStatus === 'error' && (
                <div className="mt-6 text-center">
                  <p className="text-red-400 text-sm mb-3">Erro na geração. Tente novamente.</p>
                  <button
                    onClick={() => { setGenerationStatus('idle'); handleGeneratePage() }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm border border-red-500/30 hover:bg-red-500/30"
                  >
                    Tentar novamente
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {chatView === 'preview' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 flex-shrink-0">
              <button
                onClick={() => { setGeneratedHtml(null); setPageHtmlRaw(null); setGenerationStatus('idle') }}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                ← Voltar
              </button>
              <span className="text-sm text-white/30 flex-1">Página gerada</span>
              <button
                onClick={handleDownloadHtml}
                className="px-3 py-1.5 border border-white/10 text-white/70 text-sm rounded-lg hover:text-white transition-colors"
              >
                Baixar HTML
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(generatedHtml ?? '')}
                className="px-3 py-1.5 bg-[#FFC200] text-black text-sm font-bold rounded-lg hover:bg-[#FFD740] transition-colors"
              >
                Copiar HTML
              </button>
              <GrowthEntryButton />
            </div>
            <iframe
              srcDoc={generatedHtml ?? ''}
              className="flex-1 w-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin"
              title="Página gerada"
            />

            <div className="flex-shrink-0 border-t border-white/10 p-3 bg-[#0A0B14]">
              {refineStatus === 'error' && (
                <p className="text-red-400 text-xs mb-2 px-1">Erro ao refinar. Tente de novo.</p>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={refineInstruction}
                  onChange={(e) => setRefineInstruction(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleRefine() }}
                  disabled={refineStatus === 'running'}
                  placeholder="Diga o que mudar — ex: deixe a headline mais agressiva"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FFC200]/40 disabled:opacity-50"
                />
                <button
                  onClick={handleRefine}
                  disabled={refineStatus === 'running' || !refineInstruction.trim()}
                  className="px-5 py-3 bg-[#FFC200] text-black text-sm font-bold rounded-xl hover:bg-[#FFD740] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {refineStatus === 'running' ? 'Refinando...' : 'Refinar'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}
