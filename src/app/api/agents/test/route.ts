import { NextRequest } from 'next/server'
import { streamAgentResponse } from '@/lib/gemini'
import type { OnboardingData } from '@/types'

const TICKET_LABEL: Record<string, string> = {
  'ate-97': 'até R$97 (impulso, acessível)',
  '97-297': 'R$97–R$297 (consideração moderada)',
  '297-997': 'R$297–R$997 (ticket médio-alto)',
  'acima-997': 'acima de R$997 (premium, alta consideração)',
}

function buildPrompt(data: OnboardingData): string {
  const ticket = TICKET_LABEL[data.ticket_medio] ?? data.ticket_medio
  const objetivo =
    data.objetivo_pagina === 'venda'
      ? 'página de venda para converter visitantes em compradores'
      : 'página de obrigado para confirmar compra e apresentar próximos passos'

  return `Você é um especialista em copywriting estratégico para produtores digitais brasileiros.

Com base nas informações abaixo, gere um briefing estratégico completo para a criação de uma ${objetivo}.

PRODUTO:
- Nicho: ${data.nicho}
- Produto/Serviço: ${data.produto}
- Ticket médio: ${ticket}
- Público-alvo: ${data.publico_alvo}

Inclua:
1. Análise do avatar do cliente ideal (dores, desejos, objeções)
2. Promessa principal e proposta de valor única
3. Estrutura recomendada para a página (seções e ordem)
4. Tom de voz ideal dado o ticket e o nicho
5. Gatilhos mentais mais relevantes para esse público

Escreva em português brasileiro, de forma objetiva e estratégica.`
}

export async function POST(req: NextRequest) {
  const data: OnboardingData = await req.json()
  return streamAgentResponse(buildPrompt(data))
}
