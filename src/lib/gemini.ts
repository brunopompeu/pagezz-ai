import { GoogleGenerativeAI } from '@google/generative-ai'
import { streamFromGroq } from './groq'
import { streamFromOpenRouter } from './openrouter'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
} as const

function makeStream(source: AsyncIterable<string>): Response {
  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      try {
        for await (const text of source) {
          if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify(text)}\n\n`))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } catch (err) {
        console.error('[ai] stream error:', err)
        controller.enqueue(encoder.encode('data: [ERROR]\n\n'))
      } finally {
        controller.close()
      }
    },
  })
  return new Response(readable, { headers: SSE_HEADERS })
}

async function* fromGemini(
  result: Awaited<ReturnType<ReturnType<typeof genAI.getGenerativeModel>['generateContentStream']>>,
): AsyncGenerator<string> {
  for await (const chunk of result.stream) {
    const text = chunk.text()
    if (text) yield text
  }
}

async function* fromGeminiStream(prompt: string): AsyncGenerator<string> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
  })
  const result = await model.generateContentStream(prompt)
  yield* fromGemini(result)
}

interface Provider {
  name: string
  enabled: boolean
  stream: (prompt: string) => AsyncGenerator<string>
}

function providerChain(): Provider[] {
  return [
    {
      name: `openrouter model=${process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o'}`,
      enabled: Boolean(process.env.OPENROUTER_API_KEY),
      stream: streamFromOpenRouter,
    },
    {
      name: `gemini model=${process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'}`,
      enabled: Boolean(process.env.GEMINI_API_KEY),
      stream: fromGeminiStream,
    },
    {
      name: 'groq model=llama-3.3-70b-versatile',
      enabled: Boolean(process.env.GROQ_API_KEY),
      stream: streamFromGroq,
    },
  ].filter((p) => p.enabled)
}

/**
 * Tenta cada provedor em ordem. Para cobrir falhas que só aparecem no primeiro
 * chunk (ex.: HTTP de erro do OpenRouter), buferiza o primeiro chunk de cada
 * provedor antes de comprometer com ele.
 */
async function* streamWithFallback(prompt: string): AsyncGenerator<string> {
  const providers = providerChain()
  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i]
    try {
      const gen = provider.stream(prompt)
      const first = await gen.next()
      console.log('[ai] provider=%s', provider.name)
      if (!first.done && first.value) yield first.value
      yield* gen
      return
    } catch (err) {
      const isLast = i === providers.length - 1
      console.warn(
        '[ai] provider=%s failed (%s)%s',
        provider.name,
        err instanceof Error ? err.message : err,
        isLast ? '' : ', trying next',
      )
      if (isLast) throw err
    }
  }
}

export async function* streamText(prompt: string): AsyncGenerator<string> {
  yield* streamWithFallback(prompt)
}

export async function streamAgentResponse(prompt: string): Promise<Response> {
  return makeStream(streamWithFallback(prompt))
}
