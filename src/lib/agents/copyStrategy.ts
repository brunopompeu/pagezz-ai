import { streamText } from '../gemini'

export interface CopyStrategy {
  promessa_central: string
  arco_emocional: string
  objecoes_principais: string[]
  mecanismo_apresentacao: string
  tom_comunicacao: string
}

export async function runCopyStrategy(briefing: unknown): Promise<CopyStrategy> {
  const prompt = `Você é um estrategista de copy sênior. Com base no briefing abaixo, defina a estratégia de persuasão da página de vendas.

BRIEFING:
${JSON.stringify(briefing, null, 2)}

Responda SOMENTE com um JSON válido no formato:
{
  "promessa_central": "string — a transformação que o produto entrega em 1 frase poderosa",
  "arco_emocional": "string — sequência emocional da página: dor → esperança → solução → prova → decisão (adapte ao contexto)",
  "objecoes_principais": ["string", "string", "string"],
  "mecanismo_apresentacao": "string — como apresentar o mecanismo único de forma crível e diferente",
  "tom_comunicacao": "string — tom da copy: direto/empático/autoridade/urgência/inspiracional (escolha 1-2 e justifique)"
}

Não escreva copy final. Defina a lógica estratégica que vai guiar cada seção.`

  let full = ''
  for await (const chunk of streamText(prompt)) {
    full += chunk
  }
  const match = full.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('copyStrategy: JSON não encontrado na resposta')
  return JSON.parse(match[0]) as CopyStrategy
}
