import { streamText } from '../gemini'

export type PageType =
  | 'venda-direta'
  | 'vsl'
  | 'carta-de-vendas'
  | 'captura'
  | 'obrigado'
  | 'webinar'
  | 'aplicacao'
  | 'lancamento'
  | 'squeeze'
  | 'produto-fisico'
  | 'servico'
  | 'high-ticket-consulta'

export type ConversionElement =
  | 'countdown-timer'
  | 'social-proof-toast'
  | 'sticky-cta'
  | 'progress-bar'
  | 'exit-intent-popup'
  | 'video-embed'
  | 'chat-widget'
  | 'faq-accordion'
  | 'guarantee-badge'
  | 'price-anchor'

export interface PageTypeRecommendation {
  tipo_recomendado: PageType
  justificativa: string
  alternativas: Array<{
    tipo: PageType
    tradeoff: string
  }>
  elementos_conversao: Array<{
    elemento: ConversionElement
    motivo: string
  }>
}

export async function runPageTypeRecommender(briefing: unknown): Promise<PageTypeRecommendation> {
  const prompt = `Você é um especialista em estrutura de páginas de venda. Com base no briefing abaixo, recomende o tipo de página ideal.

BRIEFING:
${JSON.stringify(briefing, null, 2)}

Tipos disponíveis: venda-direta, vsl, carta-de-vendas, captura, obrigado, webinar, aplicacao, lancamento, squeeze, produto-fisico, servico, high-ticket-consulta

Elementos de conversão disponíveis: countdown-timer, social-proof-toast, sticky-cta, progress-bar, exit-intent-popup, video-embed, chat-widget, faq-accordion, guarantee-badge, price-anchor

Responda SOMENTE com um JSON válido no formato:
{
  "tipo_recomendado": "string — um dos tipos disponíveis",
  "justificativa": "string — 1-2 frases explicando por que esse tipo é ideal para ESSE negócio específico",
  "alternativas": [
    { "tipo": "string", "tradeoff": "string — quando escolher essa alternativa e o que perde/ganha" },
    { "tipo": "string", "tradeoff": "string" }
  ],
  "elementos_conversao": [
    { "elemento": "string", "motivo": "string — por que esse elemento funciona para esse público/oferta" }
  ]
}

Recomende 3-5 elementos de conversão. Escolha com base no ticket médio e no perfil do público.`

  let full = ''
  for await (const chunk of streamText(prompt)) {
    full += chunk
  }
  const match = full.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('pageTypeRecommender: JSON não encontrado na resposta')
  return JSON.parse(match[0]) as PageTypeRecommendation
}
