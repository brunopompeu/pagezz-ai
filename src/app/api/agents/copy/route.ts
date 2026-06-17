import { NextRequest } from 'next/server'
import { streamAgentResponse } from '@/lib/gemini'
import { buildCopyPrompt } from '@/lib/agents/copy'
import type { AgentRequestBody } from '@/types'

export async function POST(req: NextRequest) {
  const { onboarding, context } = await req.json() as AgentRequestBody
  const prompt = buildCopyPrompt(onboarding, context)
  return streamAgentResponse(prompt)
}
