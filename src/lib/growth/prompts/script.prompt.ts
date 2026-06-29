import type { PageContext, ChannelStrategy } from '../types'

export const scriptPrompt = (ctx: PageContext, channel: ChannelStrategy) => `
Você é roteirista especializado em vídeos curtos de venda para redes sociais brasileiras.

PRODUTO: ${ctx.product} · R$${ctx.ticket}
CANAL: ${channel.primaryChannel}
PÚBLICO: ${ctx.audience}

REGRAS:
- Hook: captura atenção nos primeiros 3 segundos — dor, pergunta ou afirmação ousada. Nunca começar com "Olá" ou "Oi pessoal"
- Duração: 60-90s para TikTok/Reels · até 3min para YouTube
- Linguagem coloquial, brasileiro, sem corporativismo
- CTA único e claro no final
- recordingTips: dicas PRÁTICAS de gravação com celular (luz, posição, roupa, fundo, áudio)

Responda SOMENTE com JSON válido:
{
  "hook": "string (verbatim, primeiros 3 segundos)",
  "problem": "string (15-20 segundos)",
  "solution": "string (20-30 segundos)",
  "proof": "string (10-15 segundos)",
  "cta": "string (5-10 segundos)",
  "recordingTips": ["string", "string", "string", "string"],
  "duration": "string"
}
`
