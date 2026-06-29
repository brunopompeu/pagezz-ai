import { NextRequest } from 'next/server'
import { runGrowthPipeline } from '@/lib/growth/agents/runGrowthPipeline'
import type { PageContext, DiscoveryInput, GrowthState } from '@/lib/growth/types'

export const maxDuration = 120

export async function POST(req: NextRequest) {
  const { pageContext, discoveryInput, entryMode = 'post_page' }: {
    pageContext: PageContext
    discoveryInput: DiscoveryInput
    entryMode?: GrowthState['entryMode']
  } = await req.json()

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      try {
        const result = await runGrowthPipeline(
          pageContext, discoveryInput, entryMode,
          (step, payload) => send({ step, ...payload }),
        )
        send({ step: 'complete', state: result })
        send('[DONE]')
      } catch (err) {
        console.error('[growth/pipeline] error:', err)
        send({ step: 'error', message: err instanceof Error ? err.message : String(err) })
        send('[ERROR]')
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
