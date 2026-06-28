// ── Discovery ─────────────────────────────────────────────────────────────

export type TicketTier = 'low' | 'mid' | 'high'

export interface DiscoveryProof {
  tipo: 'depoimento' | 'numero' | 'print' | 'caso' | 'screenshot'
  conteudo: string
}

export interface DiscoveryBriefing {
  nicho: string
  produto: string
  objetivoReal: string
  ticketTier: TicketTier
  preco?: string

  publicoAlvo: string
  dores: string[]
  desejos: string[]
  objecoes: string[]

  provas: DiscoveryProof[]

  entregaveis: string[]
  bonus: string[]
  garantia?: string

  jaFoiTentado?: string
  contextoConcorrencia?: string
}

// ── Estratégia ────────────────────────────────────────────────────────────

export type PageType =
  | 'vendas-longa'
  | 'vendas-curta'
  | 'vsl'
  | 'webinar'
  | 'obrigado'
  | 'captura'

export interface TimerConfig {
  duracaoMinutos: number
  cor: string
  mensagem: string
  aoExpirar: 'esconder' | 'reiniciar' | 'redirecionar'
}

export interface ToastConfig {
  texto: string
  frequenciaSegundos: number
  posicao: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
}

export interface ProgressBarConfig {
  labels: string[]
  cor: string
  gatilho: 'scroll' | 'tempo'
}

export interface StickyCTAConfig {
  texto: string
  scrollPercent: number
  cor: string
}

export type ConversionElementBase =
  | { tipo: 'timer'; config: TimerConfig }
  | { tipo: 'toast'; config: ToastConfig }
  | { tipo: 'progress-bar'; config: ProgressBarConfig }
  | { tipo: 'sticky-cta'; config: StickyCTAConfig }

export type ConversionElement = ConversionElementBase & {
  justificativa: string
  ativo: boolean
}

export interface PageTypeAlternative {
  tipo: PageType
  tradeoff: string
}

export interface PageTypeRecommendation {
  tipo: PageType
  justificativa: string
  alternativas: PageTypeAlternative[]
  elementosConversao: ConversionElement[]
  colecaoNecessaria: string[]
}

export interface CopyStrategy {
  promessaCentral: string
  mecanismo: string
  arcoEmocional: string[]
  objecoesAPriorizar: string[]
}

export interface EstrategiaOutput {
  pageType: PageTypeRecommendation
  copyStrategy: CopyStrategy
}

// ── Briefing Room ─────────────────────────────────────────────────────────

export type BriefingAssetTipo =
  | 'depoimento'
  | 'print'
  | 'foto-modulo'
  | 'bonus'
  | 'historia-pessoal'
  | 'numero'
  | 'video'

export interface BriefingAsset {
  id: string
  tipo: BriefingAssetTipo
  elemento: string
  label: string
  conteudo: string
  isPlaceholder: boolean
}

export interface BriefingRoomData {
  assets: BriefingAsset[]
  paginaTipoEscolhido: PageType
  elementosConversaoAtivos: ConversionElement[]
}

// ── Pipeline ──────────────────────────────────────────────────────────────

export type PipelineStage =
  | 'idle'
  | 'discovery'
  | 'estrategia'
  | 'briefing-room'
  | 'geracao'
  | 'refinamento'

export type DiscoveryAgentName = 'intake' | 'market' | 'product'
export type EstrategiaAgentName = 'copy-strategy' | 'page-type-recommender'
export type GeracaoAgentName = 'page-architect' | 'page-writer' | 'page-designer' | 'page-builder'
export type PipelineAgentName =
  | DiscoveryAgentName
  | EstrategiaAgentName
  | 'briefing-orchestrator'
  | GeracaoAgentName
  | 'refine'

export interface PipelineState {
  stage: PipelineStage
  briefing: DiscoveryBriefing | null
  estrategia: EstrategiaOutput | null
  briefingRoom: BriefingRoomData | null
  htmlFinal: string | null
  error: string | null
}
