import { NextRequest } from 'next/server'
import { runRefineHtml } from '@/lib/agents/refineHtml'

export const maxDuration = 120

export async function POST(req: NextRequest) {
  try {
    const { html, instrucao } = await req.json()
    if (!html || !instrucao) {
      return Response.json({ error: 'html e instrucao são obrigatórios' }, { status: 400 })
    }
    const out = await runRefineHtml(html, instrucao)
    return Response.json({ html: out })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
