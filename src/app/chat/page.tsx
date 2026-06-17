'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { buildPage } from '@/lib/templates/buildPage'
import { selectTemplate } from '@/lib/templates/selectTemplate'
import type { PageData, ThemeName, StructureName } from '@/lib/templates/types'

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

interface PageUpdate {
  fields?: Partial<PageData> | null
  design?: Design
}

interface AiResponse {
  message: string
  page_update: PageUpdate
}

interface ConversationSummary {
  id: string
  title: string
  createdAt: number
  messageCount: number
}

interface ConversationData {
  messages: Message[]
  pageData: Partial<PageData>
  design: Design
  isCustomDesign?: boolean
}

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
    const d = JSON.parse(r) as ConversationData & { sections?: Record<string, string> }
    // migrate old format that used sections
    if (!d.pageData) d.pageData = {}
    return d
  } catch { return null }
}
function saveConvData(id: string, d: ConversationData) { localStorage.setItem(convKey(id), JSON.stringify(d)) }

// ─── Page builder ─────────────────────────────────────────────────────────────

function buildPreviewHtml(partialData: Partial<PageData>, customDesign: Design | null): string {
  const hasContent = Boolean(partialData.headline || partialData.nomeProduto)

  if (!hasContent) {
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0A0B14;color:#F5F5F7;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}.p{text-align:center;opacity:.3}.p p{font-size:14px;margin-top:8px}</style>
</head><body><div class="p"><div style="font-size:48px">📄</div><p>Sua página aparecerá aqui conforme a conversa avança</p></div></body></html>`
  }

  const structure: StructureName = partialData.structure ?? 'low-ticket'
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
      page_update: { fields: null },
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
  const [pageData, setPageData] = useState<Partial<PageData>>({})
  const [design, setDesign] = useState<Design>(DEFAULT_DESIGN)
  const [isCustomDesign, setIsCustomDesign] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
        setPageData(conv.pageData ?? {})
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
    saveConvData(newId, { messages: [INITIAL_MESSAGE], pageData: {}, design: DEFAULT_DESIGN, isCustomDesign: false })
    saveHistory(newHist)
    localStorage.setItem(STORAGE_CURRENT_ID, newId)

    setCurrentId(newId)
    setHistory(newHist)
    setMessages([INITIAL_MESSAGE])
    setPageData({})
    setDesign(DEFAULT_DESIGN)
    setIsCustomDesign(false)
    setShowHistory(false)
  }

  function handleNewConversation() {
    const hasProgress = messages.some((m) => m.role === 'user')
    if (hasProgress) {
      setConfirmNew(true)
    } else {
      createNewConversation(loadHistory())
    }
  }

  function switchConversation(id: string) {
    if (id === currentId) { setShowHistory(false); return }
    const conv = loadConvData(id)
    if (!conv) return
    localStorage.setItem(STORAGE_CURRENT_ID, id)
    setCurrentId(id)
    setMessages(conv.messages.length > 0 ? conv.messages : [INITIAL_MESSAGE])
    setPageData(conv.pageData ?? {})
    setDesign(conv.design)
    setIsCustomDesign(conv.isCustomDesign ?? false)
    setShowHistory(false)
  }

  function persistAfterMessage(
    id: string,
    msgs: Message[],
    pd: Partial<PageData>,
    des: Design,
    isCustDes: boolean,
  ) {
    saveConvData(id, { messages: msgs, pageData: pd, design: des, isCustomDesign: isCustDes })
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
      const pageUpdate = parsed?.page_update

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: displayText,
        rawJson: accumulated,
      }

      const finalMessages = [...nextMessages, assistantMsg]
      setMessages(finalMessages)

      let newPageData = pageData
      let newDesign = design
      let newIsCustomDesign = isCustomDesign

      if (pageUpdate?.fields) {
        newPageData = { ...pageData, ...pageUpdate.fields }
        setPageData(newPageData)
      }

      if (pageUpdate?.design) {
        newDesign = { ...design, ...pageUpdate.design }
        setDesign(newDesign)
        newIsCustomDesign = true
        setIsCustomDesign(true)
      }

      persistAfterMessage(currentId, finalMessages, newPageData, newDesign, newIsCustomDesign)
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
    const html = buildPreviewHtml(pageData, isCustomDesign ? design : null)
    navigator.clipboard.writeText(html)
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const isFinished = Boolean(pageData.headline)
  const fullPageHtml = buildPreviewHtml(pageData, isCustomDesign ? design : null)

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
                      <button
                        key={conv.id}
                        onClick={() => switchConversation(conv.id)}
                        className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-[var(--surface)] ${
                          conv.id === currentId ? 'bg-[var(--surface)] border-l-2 border-[var(--primary)]' : ''
                        }`}
                      >
                        <span className="truncate text-xs font-medium text-[var(--text-primary)]">{conv.title}</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">
                          {conv.messageCount} {conv.messageCount === 1 ? 'mensagem' : 'mensagens'} · {formatDate(conv.createdAt)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
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

        {/* Left: Chat */}
        <div className="flex w-1/2 flex-col border-r border-[var(--border)]">
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

        {/* Right: Preview */}
        <div className="flex w-1/2 flex-col bg-[var(--bg)]">
          <div className="shrink-0 border-b border-[var(--border)] px-4 py-2">
            <p className="text-xs text-[var(--text-secondary)]">Preview da página</p>
          </div>
          <iframe
            srcDoc={fullPageHtml}
            className="flex-1 w-full border-0"
            title="preview"
            sandbox="allow-scripts"
          />
        </div>
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
