import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY })

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

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
        console.error('[chat] stream error:', err)
        controller.enqueue(encoder.encode('data: [ERROR]\n\n'))
      } finally {
        controller.close()
      }
    },
  })
  return new Response(readable, { headers: SSE_HEADERS })
}

async function* fromGroqChat(
  messages: ChatMessage[],
  systemPrompt: string,
): AsyncGenerator<string> {
  const stream = await groqClient.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    stream: true,
    temperature: 0.7,
    max_tokens: 2048,
  })

  for await (const chunk of stream as AsyncIterable<Groq.Chat.ChatCompletionChunk>) {
    const text = chunk.choices[0]?.delta?.content ?? ''
    if (text) yield text
  }
}

export async function streamChatResponse(
  messages: ChatMessage[],
  systemPrompt: string,
): Promise<Response> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  })

  try {
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const chat = model.startChat({ history })
    const result = await chat.sendMessageStream(messages[messages.length - 1].content)

    console.log('[chat] provider=gemini model=%s', process.env.GEMINI_MODEL ?? 'gemini-2.0-flash')

    async function* fromGemini(): AsyncGenerator<string> {
      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) yield text
      }
    }

    return makeStream(fromGemini())
  } catch (primaryErr) {
    console.warn(
      '[chat] Gemini failed (%s), falling back to Groq',
      primaryErr instanceof Error ? primaryErr.message : primaryErr,
    )

    try {
      console.log('[chat] provider=groq model=llama-3.3-70b-versatile (fallback)')
      return makeStream(fromGroqChat(messages, systemPrompt))
    } catch (fallbackErr) {
      console.error(
        '[chat] Groq fallback also failed:',
        fallbackErr instanceof Error ? fallbackErr.message : fallbackErr,
      )
      return Response.json(
        { error: 'Todos os provedores de IA falharam. Tente novamente mais tarde.' },
        { status: 500 },
      )
    }
  }
}
