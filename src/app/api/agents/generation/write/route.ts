import { NextRequest } from 'next/server'
import { runPageWriter } from '@/lib/agents/pageWriter'

export async function POST(req: NextRequest) {
  try {
    const { briefing, materiais, copyStrategy, tipoPagina, elementosConversao } = await req.json()
    const content = await runPageWriter(briefing, materiais, copyStrategy, tipoPagina, elementosConversao)
    return Response.json(content)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
