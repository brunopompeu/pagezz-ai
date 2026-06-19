export type ThemeName = 'dark-energy' | 'dark-premium' | 'corporate-navy'
export type StructureName = 'low-ticket' | 'authority' | 'qualification'
export type HeroStyle = 'a' | 'b'

export interface ThemeVars {
  primary: string
  primaryDk: string
  accent: string
  bg: string
  bgAlt: string
  bgDark: string
  text: string
  text2: string
  textInv: string
  fontHeadline: string
  fontBody: string
  fontUrl: string
}

export interface PageData {
  // Dados do produtor
  nomeProduto: string
  nomeProdutor?: string
  nicho: string
  ticket_medio: string
  publico: string
  objetivo: 'venda' | 'obrigado' | 'qualificacao'

  // Copy (Agente de Copy)
  headline: string
  subheadline: string
  lead?: string
  agitacaoProblema?: string
  revelacaoSolucao?: string
  entregaveis?: Array<{ icone: string; titulo: string; descricao: string }>
  paraQuemE?: string[]
  naoParaQuem?: string[]
  depoimentos?: Array<{ nome: string; resultado: string; texto: string; descricao?: string }>
  garantia?: string
  urgencia?: string
  faq?: Array<{ pergunta: string; resposta: string }>
  textoCta: string
  headlineFinal?: string

  // Produto (Agente de Produto)
  preco?: string
  precoDe?: string
  parcelamento?: string
  bonus?: { titulo: string; descricao: string }

  // Autoridade — Categoria B (sugerido pela IA, produtor confirma)
  numAnos?: string
  numClientes?: string
  numResultado?: string
  labelResultado?: string
  citacaoProdutor?: string
  midias?: string[]

  // Qualificação (Template 3)
  dorsQualificacao?: string[]
  labelQualificacao1?: string
  opcoesQualificacao?: string[]
  tituloFormulario?: string
  subtituloFormulario?: string
  garantiaCartorio?: string
  numEmpresas?: string
  numPaises?: string
  numNPS?: string
  numExtra?: string
  labelExtra?: string

  // Mídia
  heroImage?: string // base64 data URI or URL

  // Configuração
  heroStyle: HeroStyle
  theme: ThemeName
  structure: StructureName

  // Metadados de campos sugeridos (para painel de edição)
  camposSugeridos?: string[]
}

export interface TemplateConfig {
  structure: StructureName
  theme: ThemeName
  heroStyle: HeroStyle
}
