import type { OnboardingData } from '@/types'

export type AgentRunner = (data: OnboardingData) => Promise<string>
