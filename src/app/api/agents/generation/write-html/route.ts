import { NextRequest } from 'next/server'
import { runPageWriterHtml } from '@/lib/agents/pageWriterHtml'

export const maxDuration = 120 // GLM-flash gera em ~64s; 60s estouraria em produção

export async function POST(req: NextRequest) {
  try {
    const { briefing, materiais, copyStrategy, tipoPagina, elementosConversao, temHeroImagem } =
      await req.json()
    const html = await runPageWriterHtml(
      briefing,
      materiais ?? {},
      copyStrategy ?? {},
      tipoPagina ?? '',
      elementosConversao ?? [],
      Boolean(temHeroImagem),
    )
    return Response.json({ html })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
