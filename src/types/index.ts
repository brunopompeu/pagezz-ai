export interface OnboardingData {
  nicho: string
  produto: string
  ticket_medio: string
  publico_alvo: string
  objetivo_pagina: 'venda' | 'obrigado'
}

export type AgentStatus = 'idle' | 'thinking' | 'done' | 'error'

export interface AgentState {
  name: string
  label: string
  emoji: string
  activity: string
  status: AgentStatus
  output: string
}

export interface AgentContext {
  market?: string
  product?: string
  copy?: string
  design?: string
}

export interface AgentRequestBody {
  onboarding: OnboardingData
  context: AgentContext
}
