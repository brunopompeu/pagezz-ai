@AGENTS.md

# Pagezz.AI

Next.js app que gera páginas de venda via pipeline multi-agente com IA.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- React 19 + framer-motion
- Google Generative AI (`@google/generative-ai`) — Gemini 2.0 Flash (primário)
- Groq SDK (`groq-sdk`) — Llama 3.3 70B Versatile (fallback automático)
- SSE streaming via `ReadableStream` / `AsyncGenerator`

## Arquitetura

### Camada de IA (`src/lib/`)

- `gemini.ts` — exporta `streamAgentResponse(prompt)`. Tenta Gemini primeiro; em caso de erro/rate limit, cai automaticamente para Groq via `streamFromGroq`.
- `groq.ts` — exporta `streamFromGroq(prompt): AsyncGenerator<string>`. Usado como fallback pelo `gemini.ts`.

### Pipeline de agentes (`src/lib/agents/`)

4 agentes executados em sequência. Cada um recebe `OnboardingData` + `AgentContext` (output acumulado dos anteriores):

1. `market.ts` — análise de mercado e posicionamento
2. `product.ts` — mapeamento da oferta e mecanismo único
3. `copy.ts` — estrutura de copy da página
4. `design.ts` — estrutura visual e layout

Cada agente importa `getTicketStrategy` de `ticketStrategy.ts` e injeta diretrizes específicas por faixa de ticket no prompt.

### Estratégia por ticket (`src/lib/agents/ticketStrategy.ts`)

Mapeia os 4 valores do formulário para 3 tiers de estratégia:

| Valor | Tier | Estratégia |
|---|---|---|
| `ate-97`, `97-297` | low | Urgência, preço visível no botão, página curta |
| `297-997` | mid | Prova social, garantia, mecanismo único |
| `acima-997` | high | Autoridade, sem preço exposto, CTA para consulta |

### Rotas de API (`src/app/api/agents/*/route.ts`)

4 rotas POST (`/api/agents/market`, `/product`, `/copy`, `/design`). Cada uma lê `{ onboarding, context }` do body e chama `streamAgentResponse` com o prompt do agente correspondente.

### Frontend

- `src/hooks/useAgentStream.ts` — pipeline sequencial. Chama os 4 agentes em ordem, acumula output em `AgentContext`, expõe `agents[]`, `activeOutput`, `overallStatus`.
- `src/components/agents/AgentCard.tsx` — card de status por agente. Quando `status === 'thinking'`, exibe `{emoji} {label} {activity}`.
- `src/components/agents/AgentStream.tsx` — área de output do stream ativo com cursor animado.
- `src/app/generate/page.tsx` — tela de geração com os 4 cards + stream de output.

## Tipos principais (`src/types/index.ts`)

```ts
interface OnboardingData {
  nicho: string
  produto: string
  ticket_medio: 'ate-97' | '97-297' | '297-997' | 'acima-997'
  publico_alvo: string
  objetivo_pagina: 'venda' | 'obrigado'
}

interface AgentState {
  name: string
  label: string
  emoji: string
  activity: string
  status: 'idle' | 'thinking' | 'done' | 'error'
  output: string
}
```

## Variáveis de ambiente

```
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash   # opcional, default gemini-2.0-flash
GROQ_API_KEY=
```

## Fluxo do usuário

1. `/onboarding` — formulário de 5 passos (`OnboardingForm`)
2. Dados salvos em `localStorage` como `pagezz_onboarding`
3. Redirect para `/generate`
4. Usuário clica "Iniciar Geração" → pipeline executa os 4 agentes em sequência
5. Output final = HTML/estrutura da página de venda gerada pelo agente de design
