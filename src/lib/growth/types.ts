export interface PageContext {
  niche: string
  product: string
  ticket: number          // valor representativo em R$ (97, 197, 497, 1997)
  ticketLabel: string     // label legível: 'até R$97' | 'R$97-297' etc.
  audience: string
  objective: string
}
export type TicketTier = 'low' | 'mid' | 'high' | 'ultra'
export interface DiscoveryInput {
  budget: 'zero' | 'low' | 'medium' | 'high'
  hoursPerWeek: number
  hasAudience: boolean
  audienceSize?: number
  hasPostedContent: boolean
  mainGoal: 'first_sale' | 'scale' | 'launch'
}
export type Channel =
  | 'tiktok' | 'instagram_reels' | 'instagram_feed' | 'instagram_stories'
  | 'youtube' | 'facebook' | 'google_ads' | 'email' | 'whatsapp'
  | 'linkedin' | 'kwai' | 'pinterest'
export interface ChannelStrategy {
  primaryChannel: Channel
  supportChannels: Channel[]
  approach: 'organic' | 'paid' | 'hybrid'
  rationale: string
  organicPath?: OrganicPath
  paidPath?: PaidPath
}
export interface OrganicPath {
  contentTypes: string[]
  postingFrequency: string
  firstSteps: string[]
}
export interface PaidPath {
  platform: string
  budgetAllocation: { testing: number; scaling: number; remarketing: number }
  campaignType: string
  audience: string
}
export interface FunnelStrategy {
  type: 'direct_response' | 'nurture_webinar' | 'authority_application' | 'qualification'
  stages: { name: string; description: string; content: string; duration: string }[]
  abTest: { element: string; variantA: string; variantB: string; metric: string }
  timeline: string
}
export interface ExecutionPlan {
  weeks: WeekPlan[]
  quickWins: string[]
  budgetPlan?: { weeklyBudget: number; breakdown: { label: string; amount: number; percentage: number }[] }
}
export interface WeekPlan {
  week: number
  theme: string
  tasks: {
    day?: string
    action: string
    channel: Channel
    contentType: 'video' | 'image' | 'text' | 'story' | 'ad'
    tip?: string
  }[]
}
export interface VideoScript {
  hook: string
  problem: string
  solution: string
  proof: string
  cta: string
  recordingTips: string[]
  duration: string
}
export interface AdCopyVariants {
  variants: {
    label: string
    headline: string
    primaryText: string
    cta: string
    angle: string
  }[]
  usage: string
}
export interface ImageBrief {
  approach: 'photo_direction' | 'ai_generated' | 'both'
  photoDirection?: {
    scene: string; lighting: string; outfit: string
    expression: string; background: string; props: string[]
  }
  aiPrompt?: string
  style: string
  doList: string[]
  dontList: string[]
}
export interface GrowthState {
  pageContext?: PageContext
  discoveryInput?: DiscoveryInput
  ticketTier?: TicketTier
  channelStrategy?: ChannelStrategy
  funnelStrategy?: FunnelStrategy
  executionPlan?: ExecutionPlan
  videoScript?: VideoScript
  adCopy?: AdCopyVariants
  imageBrief?: ImageBrief
  currentStep: 'discovery' | 'strategy' | 'plan' | 'briefing' | 'done'
  entryMode: 'post_page' | 'direct'
}
