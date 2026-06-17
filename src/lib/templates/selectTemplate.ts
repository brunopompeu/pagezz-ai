import type { StructureName, ThemeName, HeroStyle } from './types'

const TICKET_TO_STRUCTURE: Record<string, StructureName> = {
  'ate-97': 'low-ticket',
  '97-297': 'low-ticket',
  '297-997': 'authority',
  'acima-997': 'qualification',
}

const CORPORATE_NICHO = [
  'finanças', 'financas', 'investimentos', 'empresarial', 'negócios', 'negocios',
  'contabilidade', 'gestão', 'gestao', 'b2b', 'corporativo', 'empreendedor',
  'aceleração', 'aceleracao',
]

const PREMIUM_NICHO = [
  'mentoria', 'consultoria', 'marketing', 'vendas', 'liderança', 'lideranca',
  'coaching', 'estratégia', 'estrategia', 'comunicação', 'comunicacao',
  'relacionamento', 'luxo',
]

export function selectTemplate(
  ticket_medio: string,
  nicho: string,
): { structure: StructureName; theme: ThemeName; heroStyle: HeroStyle } {
  const structure = TICKET_TO_STRUCTURE[ticket_medio] ?? 'authority'

  const nichoLower = nicho.toLowerCase()
  const theme: ThemeName =
    CORPORATE_NICHO.some(n => nichoLower.includes(n)) ? 'corporate-navy' :
    PREMIUM_NICHO.some(n => nichoLower.includes(n)) ? 'dark-premium' :
    'dark-energy'

  return { structure, theme, heroStyle: 'a' }
}
