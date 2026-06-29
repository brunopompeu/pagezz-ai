import type { PageContext, ChannelStrategy, FunnelStrategy, DiscoveryInput } from '../types'

export const plannerPrompt = (
  ctx: PageContext, channel: ChannelStrategy, funnel: FunnelStrategy, disc: DiscoveryInput
) => `
Você é coach de produtividade para produtores digitais. Transforma estratégia em plano semanal executável.

PRODUTO: ${ctx.product}
CANAL PRIMÁRIO: ${channel.primaryChannel}
TIPO DE FUNIL: ${funnel.type}
HORAS DISPONÍVEIS: ${disc.hoursPerWeek}h/semana
VERBA: ${disc.budget}

REGRAS:
- Máximo 5 tarefas por semana
- Cada tarefa DEVE ser específica ("Gravar Reel mostrando resultado X", não "Criar conteúdo")
- Respeitar horas disponíveis — poucas horas = menos tarefas, mais impacto
- quickWins: 3 ações que levam menos de 1h cada, para fazer hoje
- budgetPlan: incluir somente se budget != 'zero'; alocação da verba semanal
- Plano de 4 semanas

Responda SOMENTE com JSON válido:
{
  "weeks": [
    {
      "week": 1,
      "theme": "string",
      "tasks": [
        { "day": "string", "action": "string", "channel": "string", "contentType": "video|image|text|story|ad", "tip": "string" }
      ]
    }
  ],
  "quickWins": ["string", "string", "string"],
  "budgetPlan": null
}
`
