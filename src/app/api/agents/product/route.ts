import { NextRequest } from 'next/server'
import { streamAgentResponse } from '@/lib/gemini'
import { buildProductPrompt } from '@/lib/agents/product'
import type { AgentRequestBody } from '@/types'

export async function POST(req: NextRequest) {
  const { onboarding, context } = await req.json() as AgentRequestBody
  const prompt = buildProductPrompt(onboarding, context)
  return streamAgentResponse(prompt)
}
