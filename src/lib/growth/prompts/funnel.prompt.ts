import type { PageContext, ChannelStrategy, TicketTier } from '../types'

export const funnelPrompt = (ctx: PageContext, channel: ChannelStrategy, tier: TicketTier) => `
Você é especialista em funis de venda para produtos digitais brasileiros.

PRODUTO: ${ctx.product} (R$${ctx.ticket}) · faixa: ${tier}
CANAL PRIMÁRIO: ${channel.primaryChannel} · abordagem: ${channel.approach}
PÚBLICO: ${ctx.audience}

TIPO DE FUNIL POR FAIXA (obrigatório):
- low  → direct_response: 2-3 etapas, oferta direta, sem nutrição
- mid  → nurture_webinar: 4-5 etapas, sequência de e-mail + evento
- high → authority_application: 5-6 etapas, conteúdo de autoridade + formulário
- ultra→ qualification: 4 etapas, qualificação rigorosa, sem preço exposto

ELEMENTO DE TESTE A/B POR FAIXA:
- low:   headline do anúncio ou primeiro frame do vídeo
- mid:   assunto do e-mail de convite
- high:  ângulo do conteúdo de autoridade
- ultra: pergunta qualificadora principal

Responda SOMENTE com JSON válido:
{
  "type": "string",
  "stages": [
    { "name": "string", "description": "string", "content": "string", "duration": "string" }
  ],
  "abTest": { "element": "string", "variantA": "string", "variantB": "string", "metric": "string" },
  "timeline": "string"
}
`
