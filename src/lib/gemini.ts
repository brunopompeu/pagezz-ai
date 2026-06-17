import { GoogleGenerativeAI } from '@google/generative-ai'
import { streamFromGroq } from './groq'

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

export async function streamAgentResponse(prompt: string): Promise<Response> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
  })

  try {
    const result = await model.generateContentStream(prompt)
    console.log('[ai] provider=gemini model=%s', process.env.GEMINI_MODEL ?? 'gemini-2.0-flash')
    return makeStream(fromGemini(result))
  } catch (primaryErr) {
    console.warn(
      '[ai] Gemini failed (%s), falling back to Groq',
      primaryErr instanceof Error ? primaryErr.message : primaryErr,
    )

    try {
      console.log('[ai] provider=groq model=llama-3.3-70b-versatile (fallback)')
      return makeStream(streamFromGroq(prompt))
    } catch (fallbackErr) {
      console.error(
        '[ai] Groq fallback also failed:',
        fallbackErr instanceof Error ? fallbackErr.message : fallbackErr,
      )
      return Response.json(
        { error: 'Todos os provedores de IA falharam. Tente novamente mais tarde.' },
        { status: 500 },
      )
    }
  }
}
