export type TicketTier = 'low' | 'mid' | 'high'

export interface TicketStrategy {
  tier: TicketTier
  directives: string
}

const STRATEGIES: Record<TicketTier, string> = {
  low: `ESTRATÉGIA DE TICKET BAIXO (até R$297):
- Priorize URGÊNCIA e escassez real (vagas, prazo, bônus)
- Exiba o preço com clareza no botão de CTA ("Quero por apenas R$X")
- Página CURTA e direta — elimine seções longas, foque em 1 problema → 1 solução → CTA
- Use gatilhos de impulsividade: "Hoje por apenas", "Últimas vagas", "Bônus por tempo limitado"
- Prova social com depoimentos rápidos e objetivos`,

  mid: `ESTRATÉGIA DE TICKET MÉDIO (R$297–R$997):
- PROVA SOCIAL robusta: cases reais, depoimentos com resultados específicos, números
- GARANTIA explícita e destacada (ex: "7 dias ou seu dinheiro de volta, sem perguntas")
- Apresente o MECANISMO ÚNICO — o que faz sua solução diferente de tudo que existe
- Justifique o preço com o valor entregue e o custo da inação
- Inclua selos de segurança, certificações ou reconhecimentos`,

  high: `ESTRATÉGIA DE HIGH TICKET (acima de R$997):
- AUTORIDADE total: experiência, credenciais, resultados transformadores de clientes
- NÃO exiba o preço — direcione para consulta, aplicação ou reunião estratégica
- Foque na TRANSFORMAÇÃO e no resultado final, não em features ou módulos
- Filtre o público: fale diretamente com quem está pronto para investir sério
- Use linguagem de exclusividade e pertencimento: "Para quem quer...", "Apenas para..."
- CTA deve ser "Quero me candidatar", "Solicitar minha vaga", "Agendar conversa"`,
}

const TIER_MAP: Record<string, TicketTier> = {
  'ate-97': 'low',
  '97-297': 'low',
  '297-997': 'mid',
  'acima-997': 'high',
}

export function getTicketStrategy(ticket: string): TicketStrategy {
  const tier = TIER_MAP[ticket] ?? 'mid'
  return { tier, directives: STRATEGIES[tier] }
}
