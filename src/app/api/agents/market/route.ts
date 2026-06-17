import { NextRequest } from 'next/server'
import { streamAgentResponse } from '@/lib/gemini'
import { buildMarketPrompt } from '@/lib/agents/market'
import type { AgentRequestBody } from '@/types'

export async function POST(req: NextRequest) {
  const { onboarding, context } = await req.json() as AgentRequestBody
  const prompt = buildMarketPrompt(onboarding, context)
  return streamAgentResponse(prompt)
}
