import { NextRequest } from 'next/server'
import { streamAgentResponse } from '@/lib/gemini'
import { buildDesignPrompt } from '@/lib/agents/design'
import type { AgentRequestBody } from '@/types'

export async function POST(req: NextRequest) {
  const { onboarding, context } = await req.json() as AgentRequestBody
  const prompt = buildDesignPrompt(onboarding, context)
  return streamAgentResponse(prompt)
}
