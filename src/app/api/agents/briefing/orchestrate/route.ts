import { NextRequest } from 'next/server'
import { runBriefingOrchestrator } from '@/lib/agents/briefingOrchestrator'

export async function POST(req: NextRequest) {
  try {
    const { briefing, tipoPagina, elementosConversao } = await req.json()
    const fields = await runBriefingOrchestrator(briefing, tipoPagina, elementosConversao)
    return Response.json(fields)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
