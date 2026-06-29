import { streamText } from '@/lib/gemini'
import { getTicketTierByValue } from '../context'
import { channelPrompt } from '../prompts/channel.prompt'
import { funnelPrompt }  from '../prompts/funnel.prompt'
import { plannerPrompt } from '../prompts/planner.prompt'
import { scriptPrompt }  from '../prompts/script.prompt'
import { copyPrompt }    from '../prompts/copy.prompt'
import { imagePrompt }   from '../prompts/image.prompt'
import type {
  PageContext, DiscoveryInput, GrowthState,
  ChannelStrategy, FunnelStrategy, ExecutionPlan,
  VideoScript, AdCopyVariants, ImageBrief,
} from '../types'

async function collectStream(prompt: string): Promise<string> {
  let full = ''
  for await (const chunk of streamText(prompt)) full += chunk
  return full
}

function parseJSON<T>(raw: string): T {
  const clean = raw.replace(/```json|```/g, '').trim()
  const match = clean.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('growth pipeline: JSON não encontrado na resposta do modelo')
  return JSON.parse(match[0]) as T
}

type ProgressCallback = (step: string, payload: Record<string, unknown>) => void

export async function runGrowthPipeline(
  pageCtx: PageContext,
  discovery: DiscoveryInput,
  entryMode: GrowthState['entryMode'],
  onProgress: ProgressCallback,
): Promise<GrowthState> {
  const tier = getTicketTierByValue(pageCtx.ticket)

  onProgress('channel', { status: 'running' })
  const channelStrategy = parseJSON<ChannelStrategy>(
    await collectStream(channelPrompt(pageCtx, discovery, tier)),
  )
  onProgress('channel', { status: 'done', data: channelStrategy })

  onProgress('funnel', { status: 'running' })
  const funnelStrategy = parseJSON<FunnelStrategy>(
    await collectStream(funnelPrompt(pageCtx, channelStrategy, tier)),
  )
  onProgress('funnel', { status: 'done', data: funnelStrategy })

  onProgress('planner', { status: 'running' })
  const executionPlan = parseJSON<ExecutionPlan>(
    await collectStream(plannerPrompt(pageCtx, channelStrategy, funnelStrategy, discovery)),
  )
  onProgress('planner', { status: 'done', data: executionPlan })

  onProgress('creative', { status: 'running' })
  const needsVideo = ['tiktok', 'instagram_reels', 'youtube'].includes(channelStrategy.primaryChannel)

  const [scriptRaw, copyRaw, imageRaw] = await Promise.all([
    needsVideo ? collectStream(scriptPrompt(pageCtx, channelStrategy)) : Promise.resolve('null'),
    collectStream(copyPrompt(pageCtx, channelStrategy, funnelStrategy)),
    collectStream(imagePrompt(pageCtx, channelStrategy, tier)),
  ])

  const videoScript = needsVideo ? parseJSON<VideoScript>(scriptRaw) : undefined
  const adCopy      = parseJSON<AdCopyVariants>(copyRaw)
  const imageBrief  = parseJSON<ImageBrief>(imageRaw)

  onProgress('creative', { status: 'done', data: { videoScript, adCopy, imageBrief } })

  return {
    pageContext: pageCtx,
    discoveryInput: discovery,
    ticketTier: tier,
    channelStrategy,
    funnelStrategy,
    executionPlan,
    videoScript,
    adCopy,
    imageBrief,
    currentStep: 'done',
    entryMode,
  }
}
