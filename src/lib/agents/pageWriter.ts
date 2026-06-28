import { streamText } from '../gemini'

export interface PageContent {
  headline: string
  subheadline: string
  cta_texto: string
  pain_points: string[]
  benefits: string[]
  mecanismo_descricao: string
  social_proof_intro: string
  oferta_descricao: string
  urgencia_texto: string
  garantia_texto: string
  faq?: Array<{ pergunta: string; resposta: string }>
  countdown_mensagem?: string
  toast_mensagens?: string[]
}

export async function runPageWriter(
  briefing: unknown,
  materiais: Record<string, string>,
  copyStrategy: { promessa_central: string; arco_emocional: string; objecoes_principais: string[] },
  tipoPagina: string,
  elementosConversao: string[],
): Promise<PageContent> {
  const prompt = `Você é um copywriter especialista em páginas de venda de alta conversão. Escreva o copy final da página com base no briefing e estratégia abaixo.

BRIEFING:
${JSON.stringify(briefing, null, 2)}

MATERIAIS COLETADOS DO USUÁRIO:
${JSON.stringify(materiais, null, 2)}

ESTRATÉGIA DE COPY:
- Promessa central: ${copyStrategy.promessa_central}
- Arco emocional: ${copyStrategy.arco_emocional}
- Objeções a atacar: ${copyStrategy.objecoes_principais.join(', ')}

TIPO DE PÁGINA: ${tipoPagina}
ELEMENTOS ATIVOS: ${elementosConversao.join(', ')}

Regras:
- Use os materiais coletados como base (depoimentos reais, preços, prazos)
- Siga o arco emocional na ordem do copy
- Cada pain_point: 1 frase curta e direta (máx 12 palavras)
- Cada benefit: orientado a resultado, começa com verbo (ex: "Domine...", "Elimine...")
- Se countdown-timer estiver ativo: preencha countdown_mensagem
- Se social-proof-toast estiver ativo: crie 3 toast_mensagens curtas (ex: "João de SP acabou de comprar")
- Se faq-accordion estiver ativo: escreva 4 perguntas e respostas reais sobre objeções
- headline: usa a promessa central, máx 10 palavras, impactante
- Responda SOMENTE com JSON válido

Formato:
{
  "headline": "string",
  "subheadline": "string — complementa a headline com o mecanismo ou público",
  "cta_texto": "string — ação clara e específica (máx 5 palavras)",
  "pain_points": ["string", "string", "string"],
  "benefits": ["string", "string", "string", "string", "string"],
  "mecanismo_descricao": "string — parágrafo de 2-3 frases explicando como funciona",
  "social_proof_intro": "string — frase que introduz os depoimentos",
  "oferta_descricao": "string — parágrafo descrevendo o que o cliente recebe",
  "urgencia_texto": "string — frase de urgência/escassez coerente com o contexto",
  "garantia_texto": "string — texto da garantia em linguagem de confiança",
  "faq": [{ "pergunta": "string", "resposta": "string" }],
  "countdown_mensagem": "string ou null",
  "toast_mensagens": ["string", "string", "string"] ou null
}`

  let full = ''
  for await (const chunk of streamText(prompt)) {
    full += chunk
  }

  const match = full.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('pageWriter: JSON não encontrado na resposta')
  return JSON.parse(match[0]) as PageContent
}
