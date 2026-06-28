import { streamText } from '../gemini'

export interface BriefingField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'url' | 'image'
  descricao: string
  placeholder: string
  obrigatorio: boolean
}

export async function runBriefingOrchestrator(
  briefing: unknown,
  tipoPagina: string,
  elementosConversao: string[],
): Promise<BriefingField[]> {
  const prompt = `Você é um produtor digital especialista em páginas de venda. Analise o briefing abaixo e determine exatamente quais informações ainda precisam ser coletadas do usuário para gerar a página.

BRIEFING:
${JSON.stringify(briefing, null, 2)}

TIPO DE PÁGINA: ${tipoPagina}
ELEMENTOS DE CONVERSÃO SELECIONADOS: ${elementosConversao.join(', ')}

Retorne SOMENTE um JSON array com os campos a coletar. Regras:
1. Sempre inclua: headline, subheadline, cta_texto
2. Se briefing.oferta não tiver preco_avista: inclua preco_avista (number) e preco_parcelado (text)
3. Se briefing.oferta não tiver garantia: inclua garantia_dias (number) e garantia_descricao (text)
4. Para cada elemento selecionado, inclua os campos específicos:
   - countdown-timer → timer_prazo (text), timer_mensagem (text)
   - social-proof-toast → toast_texto_1 (text), toast_texto_2 (text), toast_texto_3 (text)
   - video-embed → url_video (url)
   - faq-accordion → faq_1_pergunta (text), faq_1_resposta (textarea), faq_2_pergunta (text), faq_2_resposta (textarea)
5. Para os placeholders: crie valores realistas e coerentes com o nicho do produto. Devem funcionar como copy real caso o usuário não preencha.
6. Não repita campos que já têm valor no briefing.

Formato de cada item:
{
  "key": "string",
  "label": "string em português",
  "type": "text|textarea|number|url",
  "descricao": "string — instrução curta de preenchimento",
  "placeholder": "string — valor de exemplo inteligente para esse nicho",
  "obrigatorio": boolean
}`

  let full = ''
  for await (const chunk of streamText(prompt)) {
    full += chunk
  }

  const match = full.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('briefingOrchestrator: array JSON não encontrado na resposta')
  const fields = JSON.parse(match[0]) as BriefingField[]

  // Campo de imagem é determinístico (não vem do LLM) — sempre presente, opcional
  const heroField: BriefingField = {
    key: 'hero_imagem',
    label: 'Imagem de destaque (hero)',
    type: 'image',
    descricao: 'Imagem principal do topo da página — PNG ou JPG. Opcional.',
    placeholder: '',
    obrigatorio: false,
  }

  return [heroField, ...fields]
}
