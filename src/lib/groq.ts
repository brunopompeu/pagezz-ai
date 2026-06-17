import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function* streamFromGroq(prompt: string): AsyncGenerator<string> {
  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  })

  for await (const chunk of stream as AsyncIterable<Groq.Chat.ChatCompletionChunk>) {
    const text = chunk.choices[0]?.delta?.content ?? ''
    if (text) yield text
  }
}
