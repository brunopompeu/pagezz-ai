import type { PageContext, TicketTier, GrowthState } from './types'

const CURRENT_ID_KEY = 'pagezz_chat_current_id'
const convKey = (id: string) => `pagezz_chat_conv_${id}`
const GROWTH_KEY = 'pagezz_growth_state'

type TicketMedio = 'ate-97' | '97-297' | '297-997' | 'acima-997'

const TICKET_MAP: Record<TicketMedio, { ticket: number; ticketLabel: string; tier: TicketTier }> = {
  'ate-97':    { ticket: 97,   ticketLabel: 'até R$97',         tier: 'low' },
  '97-297':    { ticket: 197,  ticketLabel: 'R$97–297',         tier: 'low' },
  '297-997':   { ticket: 497,  ticketLabel: 'R$297–997',        tier: 'mid' },
  'acima-997': { ticket: 1997, ticketLabel: 'acima de R$997',   tier: 'high' },
}

export function getTicketTier(ticketMedio: string): TicketTier {
  return TICKET_MAP[ticketMedio as TicketMedio]?.tier ?? 'low'
}

export function loadPageContextFromBriefing(): PageContext | null {
  try {
    const id = localStorage.getItem(CURRENT_ID_KEY)
    if (!id) return null
    const raw = localStorage.getItem(convKey(id))
    if (!raw) return null
    const { briefing } = JSON.parse(raw) as { briefing: Record<string, unknown> }
    if (!(briefing?.meta as Record<string, unknown>)?.discovery_completo) return null
    const negocio = briefing.negocio as Record<string, unknown> | undefined
    const publico  = briefing.publico  as Record<string, unknown> | undefined
    const analise  = briefing.analise_produto as Record<string, unknown> | undefined
    const ticketMedio = (negocio?.ticket_medio as TicketMedio) ?? 'ate-97'
    const ticketInfo  = TICKET_MAP[ticketMedio] ?? TICKET_MAP['ate-97']
    return {
      niche:       String(negocio?.nicho     ?? ''),
      product:     String(negocio?.produto   ?? ''),
      ticket:      ticketInfo.ticket,
      ticketLabel: ticketInfo.ticketLabel,
      audience:    String(publico?.perfil    ?? ''),
      objective:   String(analise?.promessa_central ?? ''),
    }
  } catch {
    return null
  }
}

export function saveGrowthState(state: GrowthState): void {
  localStorage.setItem(GROWTH_KEY, JSON.stringify(state))
}

export function loadGrowthState(): GrowthState | null {
  try {
    const raw = localStorage.getItem(GROWTH_KEY)
    return raw ? (JSON.parse(raw) as GrowthState) : null
  } catch {
    return null
  }
}

export function clearGrowthState(): void {
  localStorage.removeItem(GROWTH_KEY)
}

export function getTicketTierByValue(ticket: number): TicketTier {
  if (ticket < 297)  return 'low'
  if (ticket < 997)  return 'mid'
  if (ticket < 5000) return 'high'
  return 'ultra'
}
