const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

const DEFAULT_MODEL = 'openai/gpt-4o'

export async function* streamFromOpenRouter(prompt: string): AsyncGenerator<string> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY não configurada')

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'https://pagezz.ai',
      'X-Title': process.env.OPENROUTER_SITE_NAME ?? 'Pagezz.AI',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  })

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => '')
    throw new Error(`OpenRouter HTTP ${res.status}: ${detail.slice(0, 200)}`)
  }

  const reader = res.body.getReader()
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
