// Cliente de geração de página com fallback. Primário + fallback opcional,
// ambos OpenAI-compatible, configurados por env. Isolado dos agentes.

const DEFAULT_URL = 'https://api.cerebras.ai/v1/chat/completions'
const DEFAULT_MODEL = 'zai-glm-4.7'
const MAX_RETRIES = 3
const RETRY_BASE_MS = 2500

interface ModelCfg { label: string; apiKey: string; name: string; baseUrl: string }

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

export function pageModelName(): string {
  return process.env.PAGE_MODEL_NAME ?? DEFAULT_MODEL
}

function providerChain(): ModelCfg[] {
  const list: ModelCfg[] = []
  if (process.env.PAGE_MODEL_API_KEY) {
    list.push({
      label: 'primary',
      apiKey: process.env.PAGE_MODEL_API_KEY,
      name: process.env.PAGE_MODEL_NAME ?? DEFAULT_MODEL,
      baseUrl: process.env.PAGE_MODEL_BASE_URL ?? DEFAULT_URL,
    })
  }
  if (process.env.PAGE_MODEL_FALLBACK_API_KEY) {
    list.push({
      label: 'fallback',
      apiKey: process.env.PAGE_MODEL_FALLBACK_API_KEY,
      name: process.env.PAGE_MODEL_FALLBACK_NAME ?? DEFAULT_MODEL,
      baseUrl: process.env.PAGE_MODEL_FALLBACK_BASE_URL ?? DEFAULT_URL,
    })
  }
  return list
}

// Uma tentativa contra UM provedor: fetch com retry em 429/1305, depois stream.
async function* streamOne(cfg: ModelCfg, prompt: string): AsyncGenerator<string> {
  let res: Response | null = null
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    res = await fetch(cfg.baseUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: cfg.name,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      }),
    })
    if (res.ok && res.body) break
    const detail = await res.text().catch(() => '')
    const overloaded = res.status === 429 || detail.includes('"1305"')
    if (overloaded && attempt < MAX_RETRIES) {
      console.warn(`[pageModel] ${cfg.label} sobrecarregado (HTTP ${res.status}), tentativa ${attempt}/${MAX_RETRIES}`)
      await sleep(RETRY_BASE_MS * attempt)
      continue
    }
    throw new Error(`${cfg.label} HTTP ${res.status}: ${detail.slice(0, 200)}`)
  }

  const reader = res!.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const data = trimmed.slice(5).trim()
      if (data === '[DONE]') return
      if (!data) continue
      try {
        const parsed = JSON.parse(data)
        const text = parsed.choices?.[0]?.delta?.content ?? ''
        if (text) yield text
      } catch {
        // ignora keep-alives / linhas parciais
      }
    }
  }
}

// Chain: tenta primário; se falhar (após retries), cai no fallback.
// Buferiza o 1º chunk pra capturar erro de conexão antes de comprometer.
export async function* streamFromPageModel(prompt: string): AsyncGenerator<string> {
  const chain = providerChain()
  if (!chain.length) throw new Error('Nenhum PAGE_MODEL configurado')

  for (let i = 0; i < chain.length; i++) {
    const cfg = chain[i]
    try {
      const gen = streamOne(cfg, prompt)
      const first = await gen.next()
      console.log('[pageModel] usando %s (%s)', cfg.label, cfg.name)
      if (!first.done && first.value) yield first.value
      yield* gen
      return
    } catch (err) {
      const isLast = i === chain.length - 1
      console.warn(
        '[pageModel] %s falhou (%s)%s',
        cfg.label,
        err instanceof Error ? err.message : err,
        isLast ? '' : ', tentando fallback',
      )
      if (isLast) throw err
    }
  }
}
