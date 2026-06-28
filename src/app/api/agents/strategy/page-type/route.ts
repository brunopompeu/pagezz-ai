import { NextRequest } from 'next/server'
import { runPageTypeRecommender } from '@/lib/agents/pageTypeRecommender'

export async function POST(req: NextRequest) {
  try {
    const { briefing } = await req.json()
    const result = await runPageTypeRecommender(briefing)
    return Response.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
