@AGENTS.md

# Pagezz.AI

Next.js app que transforma uma conversa de descoberta numa página de vendas pronta para exportar, via pipeline multi-agente com IA.

## Stack

**Aplicação**
- Next.js 16.2.9 (App Router + Turbopack) + TypeScript + Tailwind CSS v4
- React 19 + framer-motion
- Streaming via SSE (`ReadableStream` / `AsyncGenerator`)
- Estado em `localStorage` (conversas, briefing, imagens base64). No protótipo, projetos não são persistidos — o usuário exporta o HTML.
- `@supabase/supabase-js` presente (`src/lib/supabase.ts`) para controle de contas futuro; não usado no fluxo de geração.

**Duas camadas de IA, propositalmente isoladas** (uma falha de cota numa não derruba a outra):

| Camada | Arquivo | Cadeia de modelos (fallback automático na ordem) | Quem usa |
|---|---|---|---|
| Agentes (raciocínio) | `src/lib/gemini.ts` | OpenRouter (`OPENROUTER_MODEL`) → Gemini 2.0 Flash → Groq Llama 3.3 70B | intake, market, product, estratégia, briefing-orchestrator |
| Geração de HTML | `src/lib/pageModel.ts` | Cerebras `zai-glm-4.7` (primário) → Z.AI `glm-4.7-flash` (fallback) | pageWriterHtml, refineHtml |

Ambas bufferizam o 1º chunk para detectar falha antes de comprometer com o provedor. A cadeia de página tem retry em 429/1305 (backoff 2.5s/5s, 3 tentativas) e o modelo é trocável 100% por env (`PAGE_MODEL_*`).

> Por que duas camadas: a geração de HTML por templates de código produzia páginas ruins (tokens órfãos, dado inventado). Virou geração 100% por IA num modelo rápido (Cerebras, ~9-16s) — sem alterar a cadeia conversacional dos agentes.

## Camada de IA (`src/lib/`)

- `gemini.ts` — `streamText(prompt)` (AsyncGenerator) e `streamAgentResponse(prompt)` (Response SSE). Cadeia OpenRouter → Gemini → Groq com fallback.
- `groq.ts` — `streamFromGroq(prompt)`. Fallback da cadeia de agentes.
- `openrouter.ts` — `streamFromOpenRouter(prompt)`. Primário da cadeia de agentes quando há `OPENROUTER_API_KEY`.
- `pageModel.ts` — `streamFromPageModel(prompt)` + `pageModelName()`. Cliente OpenAI-compatible genérico, slot trocável por env, com retry e fallback. Isolado dos agentes.
- `chat.ts` — padrão SSE de referência para o intake conversacional.

## Pipeline de 5 estágios

Tudo evolui a partir de `/chat`. O wizard `/onboarding` → `/generate` é o modo **legado** (4 agentes fixos market→product→copy→design via `useAgentStream`).

O contrato central entre estágios é o `Briefing` (schema estruturado em JSON, montado incrementalmente; ver `src/app/chat/page.tsx`).

### Estágio 1 — Discovery
Agentes: `intake` (em `api/chat`) + `market` + `product`
- Conversa como estrategista de agência, sem roteiro fixo. Resposta no formato `{ message, briefing_update }`.
- `market`/`product` enriquecem o briefing. Termina quando `meta.discovery_completo === true`.

### Estágio 2 — Estratégia (automático, sem interação)
Agentes: `copyStrategy.ts` + `pageTypeRecommender.ts`
- `pageTypeRecommender`: tipo de página recomendado + justificativa + alternativas com tradeoffs + elementos de conversão.
- `copyStrategy`: promessa central, mecanismo, arco emocional, objeções (a lógica, não a copy).
- Usuário confirma tipo e seleciona elementos. Grava em `briefing.estrategia_pagina`.

### Estágio 3 — Briefing Room
Agente: `briefingOrchestrator.ts` → `BriefingField[]`
- Determina os materiais a coletar (depoimentos, prints, hero image, bônus) com placeholders inteligentes por nicho.
- "Gerar com o que tenho" não bloqueia — usa placeholders. Salva em `briefing.materiais`.
- Hero image: base64 → placeholder `__HERO_IMAGE__` (nunca enviado ao modelo).

### Estágio 4 — Geração
Agente: `pageWriterHtml.ts` → `runPageWriterHtml(...)`
- Gera HTML completo num passe. Prompt híbrido: tokens do tema real (`templates/themes/`) + sequência de seções por tipo + regra anti-invenção (sem dado → seção some) + regra de preço (expõe em venda/VSL, oculta em alto ticket).
- `templates/injectWidgets.ts` injeta countdown/toast/sticky theme-aware (`var(--*)`) e aplica `applyHeroImage`.
- Preview em iframe com Copiar/Baixar HTML.

### Estágio 5 — Refinamento
Agente: `refineHtml.ts` → `runRefineHtml(html, instrucao)`
- Edição cirúrgica sobre o HTML cru (`pageHtmlRaw`, sem widgets): "altere só o pedido, resto idêntico" → re-injeta widgets.

## Rotas de API (`src/app/api/`)

- `chat/route.ts` — intake conversacional (Estágio 1).
- `agents/market`, `agents/product`, `agents/copy`, `agents/design` — agentes (copy/design legados; market/product reusados no Discovery). `agents/test` — diagnóstico.
- `agents/strategy/copy`, `agents/strategy/page-type` — POST `{ briefing }` (Estágio 2).
- `agents/briefing/orchestrate` — POST `{ briefing, tipoPagina, elementosConversao }` (Estágio 3).
- `agents/generation/write-html` — POST, `maxDuration=120`, gera HTML (Estágio 4).
- `agents/generation/refine-html` — POST `{ html, instrucao }`, `maxDuration=120` (Estágio 5).
- `agents/generation/write` — legado (gerava `PageContent` para `assemblePage`).
- `preview/route.ts` — renderização de preview.

## Camada de templates (`src/lib/templates/`) — legado/parcial

Usada pelo fluxo antigo de montagem determinística. Mantida mas largamente substituída pela geração por IA.
- `assemblePage.ts` (órfão, pode ser apagado), `buildPage.ts`, `selectTemplate.ts`, `parseAgentOutput.ts`, `index.ts`, `types.ts`
- `themes/` — `dark-energy`, `dark-premium`, `corporate-navy`
- `structures/` — `low-ticket`, `authority`, `qualification`
- `heroes/` — `hero-a`, `hero-b`

## Estratégia por ticket (`src/lib/agents/ticketStrategy.ts`)

Mapeia os 4 valores de ticket em 3 tiers, injetados nos prompts:

| Valor | Tier | Estratégia |
|---|---|---|
| `ate-97`, `97-297` | low | Urgência, preço no botão, página curta |
| `297-997` | mid | Prova social, garantia, mecanismo único |
| `acima-997` | high | Autoridade, sem preço exposto, CTA para consulta |

## Frontend

- `src/app/chat/page.tsx` — orquestra os 5 estágios. `chatView`: `'chat' | 'strategy-loading' | 'strategy-ready' | 'briefing-room' | 'generating' | 'preview'`. Estados de erro graciosos por estágio (`strategy-error`). Persiste em `pagezz_chat_conv_{id}`.
- `src/hooks/useAgentStream.ts` — pipeline legado de 4 agentes (`/onboarding` → `/generate`).
- `src/components/agents/` — `AgentCard.tsx`, `AgentStream.tsx` (UI do fluxo legado).
- `src/components/onboarding/` — `OnboardingForm.tsx`, `StepIndicator.tsx`.
- `src/components/ui/` — `Button`, `Input`, `Select`.

## Páginas

- `/` — landing
- `/chat` — fluxo principal (pipeline de 5 estágios)
- `/onboarding` → `/generate` — fluxo legado (wizard de 5 passos + 4 agentes)
- `/preview` — visualização de página

## Infra / Deploy

- **Repositório:** GitHub — `github.com/brunopompeu/pagezz-ai` (remote `origin`)
- **Hospedagem:** Vercel — projeto `pagezz-ai`, framework Next.js, build `npm run build`, output `.next`, região `gru1` (São Paulo). Config em `vercel.json`; link em `.vercel/`.
- **Gerenciador de pacotes:** npm (`package-lock.json`)
- **Build/config:** `next.config.ts`, `tsconfig.json`
- Sem CI próprio (`.github/` ausente) — deploy automático via integração Vercel↔GitHub. Sem Docker.
- As variáveis de ambiente abaixo precisam estar configuradas no painel da Vercel para produção.

## Variáveis de ambiente

```
# Agentes (cadeia de raciocínio)
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-4o   # opcional
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash    # opcional
GROQ_API_KEY=

# Geração de página (slot trocável)
PAGE_MODEL_API_KEY=              # primário (Cerebras)
PAGE_MODEL_NAME=zai-glm-4.7      # opcional
PAGE_MODEL_BASE_URL=https://api.cerebras.ai/v1/chat/completions  # opcional
PAGE_MODEL_FALLBACK_API_KEY=     # fallback (Z.AI)
PAGE_MODEL_FALLBACK_NAME=
PAGE_MODEL_FALLBACK_BASE_URL=

# Supabase (contas, não usado na geração)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
