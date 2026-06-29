import Link from "next/link";
import Image from "next/image";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[rgba(13,39,114,0.15)] bg-white/80 px-3.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[rgba(13,39,114,0.55)]">
      {children}
    </span>
  );
}

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`mx-auto w-full max-w-5xl px-5 sm:px-8 ${className}`}>{children}</section>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[20px] border border-[rgba(13,39,114,0.09)] bg-white p-6 shadow-[0_4px_24px_rgba(13,39,114,0.07)] ${className}`}>
      {children}
    </div>
  );
}

function PipeStep({ num, title, tag, children }: { num: string; title: string; tag: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--eduzz-blue)] text-[0.75rem] font-extrabold text-[var(--eduzz-yellow)]">
          {num}
        </div>
        <div className="mt-1 w-0.5 flex-1 bg-[rgba(13,39,114,0.1)]" />
      </div>
      <div className="flex-1 pb-6">
        <p className="text-[0.88rem] font-extrabold text-[var(--eduzz-blue)]">{title}</p>
        <span className="mt-1.5 inline-block rounded bg-[rgba(255,193,7,0.18)] px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide text-[#92670A]">{tag}</span>
        <div className="mt-2 text-[0.8rem] leading-relaxed text-[rgba(13,39,114,0.65)]">{children}</div>
      </div>
    </div>
  );
}

export default function BusinessCaseGrowth() {
  return (
    <main className="min-h-screen bg-[#fff8e8] pb-20 text-[var(--eduzz-blue)]" style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>

      {/* NAV */}
      <header className="sticky top-4 z-50 mx-auto max-w-5xl px-5 sm:px-8">
        <div className="flex h-14 items-center justify-between rounded-full border border-white/70 bg-white/90 px-5 shadow-[0_8px_32px_rgba(13,39,114,0.10)] backdrop-blur">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/eduzz-symbol-crop.png" alt="Eduzz" width={34} height={34} className="h-8 w-8 object-contain" />
            <div className="leading-none">
              <p className="text-sm font-extrabold tracking-tight">Pagezz AI</p>
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[rgba(13,39,114,0.45)]">Eduzz Intelligence</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-full border border-[rgba(13,39,114,0.15)] px-3.5 py-2 text-xs font-semibold text-[rgba(13,39,114,0.6)] transition-colors hover:border-[rgba(13,39,114,0.35)] hover:text-[var(--eduzz-blue)]">
              ← Home
            </Link>
            <Link href="/growth" className="rounded-full bg-[var(--eduzz-blue)] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-85">
              Ver protótipo →
            </Link>
          </div>
        </div>
      </header>

      <div className="mt-8 flex flex-col gap-16">

        {/* HERO */}
        <Section className="pt-10">
          <div className="flex flex-col items-center gap-5 text-center">
            <Tag>Business Case · Growth Module · Jun 2026</Tag>
            <h1 className="max-w-3xl text-[clamp(2.4rem,7vw,4rem)] font-black leading-[1.04] tracking-[-0.04em]">
              A página é a isca.<br />A estratégia é o produto.
            </h1>
            <p className="max-w-xl text-[0.95rem] leading-[1.7] text-[rgba(13,39,114,0.65)]">
              Como o Pagezz sobe da commodity para parceiro de crescimento do produtor digital — e por que só a Eduzz consegue fazer isso.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href="/growth" className="flex items-center gap-2 rounded-xl bg-[var(--eduzz-blue)] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90">
                → Testar o Growth Module
              </Link>
              <a href="#pipeline" className="flex items-center gap-2 rounded-xl border border-[rgba(13,39,114,0.18)] bg-white px-6 py-3 text-sm font-bold text-[var(--eduzz-blue)] transition-all hover:-translate-y-0.5">
                Ver os agentes
              </a>
            </div>
          </div>
        </Section>

        {/* PROBLEMA */}
        <Section>
          <div className="flex flex-col gap-6">
            <div>
              <Tag>O Problema</Tag>
              <h2 className="mt-3 text-[1.9rem] font-black tracking-tight">Geração de página virou commodity. O que retém e expande é o que vem depois.</h2>
              <p className="mt-3 max-w-2xl text-[0.9rem] leading-[1.7] text-[rgba(13,39,114,0.65)]">
                Qualquer LLM em 2026 gera uma landing page decente. Isso não é defensável. O produtor não precisa de HTML — ele precisa de vendas.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-l-4 border-l-red-500">
                <p className="text-[0.72rem] font-extrabold uppercase tracking-wide text-red-500">❌ Só página</p>
                <p className="mt-3 text-[0.85rem] leading-relaxed text-[rgba(13,39,114,0.65)]">
                  Produtor tem HTML bonito, não sabe o que fazer com ele. Sai da plataforma, erra na divulgação, não vende, culpa a ferramenta. Churn em 30 dias.
                </p>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <p className="text-[0.72rem] font-extrabold uppercase tracking-wide text-green-600">✅ Página + Plano</p>
                <p className="mt-3 text-[0.85rem] leading-relaxed text-[rgba(13,39,114,0.65)]">
                  Produtor sai com página <em>e</em> plano de execução personalizado. Sabe exatamente o que postar, onde anunciar e com qual criativo. Retorna, converte, expande.
                </p>
              </Card>
            </div>
          </div>
        </Section>

        {/* INSIGHT */}
        <Section>
          <div className="rounded-[24px] bg-[var(--eduzz-blue)] p-10 text-center text-white">
            <h2 className="mx-auto max-w-2xl text-[clamp(1.4rem,3vw,2rem)] font-black leading-[1.25] tracking-tight">
              O Growth Module não é uma feature.<br />É a <span className="text-[var(--eduzz-yellow)]">transição de SaaS para serviço.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[0.9rem] leading-[1.7] text-white/60">
              Produtor que vende com o Pagezz não cancela. O módulo transforma o dado de checkout que a Eduzz já possui num produto de IA que a concorrência não consegue construir.
            </p>
          </div>
        </Section>

        {/* PIPELINE */}
        <Section id="pipeline">
          <div className="flex flex-col gap-6">
            <div>
              <Tag>Os Agentes</Tag>
              <h2 className="mt-3 text-[1.9rem] font-black tracking-tight">Pipeline de crescimento em 5 agentes</h2>
              <p className="mt-3 max-w-2xl text-[0.9rem] leading-[1.7] text-[rgba(13,39,114,0.65)]">
                Mesma lógica do pipeline de páginas — só que agora o output é um plano de distribuição pronto pra executar.
              </p>
            </div>
            <Card>
              <div className="flex flex-col">
                <PipeStep num="1" title="Discovery — Agente de Contexto" tag="Modo 1: 2 perguntas · Modo 2: chat completo">
                  No Modo 1 (pós-página), herda automaticamente: nicho, produto, ticket, público e objetivo. Só pergunta o que falta: verba disponível e horas por semana. Discovery curto = menos fricção pro iniciante.
                </PipeStep>
                <PipeStep num="2" title="Estrategista de Canal" tag="Output: canal primário + canais de suporte">
                  Decide <strong>orgânico vs. pago</strong> com base em ticket + verba + maturidade. Define os canais certos por nicho: TikTok, Reels, Meta Ads, Google, YouTube, e-mail. Iniciante de low ticket sem verba → orgânico por padrão.
                </PipeStep>
                <PipeStep num="3" title="Arquiteto de Funil" tag="Output: funil + variáveis de teste">
                  Desenha o funil correto para o ticket. Low ticket → resposta direta, funil curto. Mid → nutrição + webinar. High → autoridade + aplicação. Define também a estrutura de testes A/B dos criativos.
                </PipeStep>
                <PipeStep num="4" title="Planejador de Execução" tag="Output: plano semana a semana">
                  Traduz estratégia em <strong>cronograma semanal</strong>. "Semana 1: 3 Reels sobre dor X. Semana 2: depoimento Y + anúncio Z." Remove a paralisia do iniciante. Inclui alocação de verba se for pago.
                </PipeStep>
                <PipeStep num="5" title="Briefing Room — 3 especialistas em paralelo" tag="Output: ativos criativos prontos pra subir">
                  <p>Não é um agente — são três especializados rodando em paralelo:</p>
                  <ul className="mt-2 flex flex-col gap-1">
                    <li>🎬 <strong>Roteirista</strong> — se o canal pede vídeo, entrega roteiro + instruções de como gravar no celular.</li>
                    <li>✍️ <strong>Copywriter</strong> — 3 variações de copy de anúncio (headline + texto + CTA) prontas pra Meta/Google.</li>
                    <li>🖼️ <strong>Diretor de Imagem</strong> — direciona a foto a tirar ou gera a imagem via IA na hora.</li>
                  </ul>
                </PipeStep>
              </div>
            </Card>
          </div>
        </Section>

        {/* MODOS DE ENTRADA */}
        <Section>
          <div className="flex flex-col gap-6">
            <div>
              <Tag>Pontos de Entrada</Tag>
              <h2 className="mt-3 text-[1.9rem] font-black tracking-tight">Dois jeitos de chegar</h2>
              <p className="mt-3 max-w-2xl text-[0.9rem] leading-[1.7] text-[rgba(13,39,114,0.65)]">
                O Modo 1 é o ouro: captura o produtor no pico de confiança, logo depois de ver a IA construir a página dele.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[20px] bg-[var(--eduzz-blue)] p-6 shadow-[0_4px_24px_rgba(13,39,114,0.07)]">
                <span className="inline-block rounded-full bg-[rgba(255,193,7,0.2)] px-3 py-1 text-[0.62rem] font-bold uppercase tracking-wide text-[var(--eduzz-yellow)]">⭐ Prioritário · Retenção</span>
                <p className="mt-4 text-2xl">📄→📣</p>
                <p className="mt-2 text-[0.95rem] font-extrabold text-white">Modo 1 — Pós-página</p>
                <p className="mt-2 text-[0.83rem] leading-relaxed text-white/70">
                  Página gerada e refinada. Botão fixo no /preview: <strong className="text-white">"E agora, como divulgo isso?"</strong> Contexto já carregado. Discovery de 2 perguntas. Produtor está no pico de confiança — é o momento perfeito.
                </p>
              </div>
              <Card>
                <span className="inline-block rounded-full bg-[rgba(13,39,114,0.07)] px-3 py-1 text-[0.62rem] font-bold uppercase tracking-wide text-[rgba(13,39,114,0.45)]">🚀 Aquisição</span>
                <p className="mt-4 text-2xl">🌐→📣</p>
                <p className="mt-2 text-[0.95rem] font-extrabold">Modo 2 — Entrada direta</p>
                <p className="mt-2 text-[0.83rem] leading-relaxed text-[rgba(13,39,114,0.6)]">
                  Produtor que criou a página em outra ferramenta (Lovable, Framer, Durable). Chega sem contexto — discovery completo via chat. O Pagezz resolve o que nenhum page builder entrega: <strong>o que fazer depois que a página está no ar.</strong>
                </p>
              </Card>
            </div>
          </div>
        </Section>

        {/* TICKET SPLIT */}
        <Section>
          <div className="flex flex-col gap-6">
            <div>
              <Tag>Personalização por Ticket</Tag>
              <h2 className="mt-3 text-[1.9rem] font-black tracking-tight">A mesma variável que define a página define a estratégia</h2>
              <p className="mt-3 max-w-2xl text-[0.9rem] leading-[1.7] text-[rgba(13,39,114,0.65)]">
                A IA já sabe o ticket do produto. A estratégia de growth muda completamente — e isso é o que nenhum concorrente genérico faz.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  range: "R$47–197",
                  tier: "Low Ticket",
                  items: ["Orgânico → primeiros clientes", "TikTok / Reels urgência", "Funil direto, sem nutrição", "Criativos de volume", "Meta Ads quando tiver verba"],
                },
                {
                  range: "R$297–597",
                  tier: "Mid Ticket",
                  items: ["Prova social em vídeo", "Instagram + YouTube", "Sequência de nutrição", "Webinar ou live", "Remarketing"],
                },
                {
                  range: "R$997–4.999",
                  tier: "High Ticket",
                  items: ["Autoridade e conteúdo longo", "YouTube + LinkedIn", "Sem preço no anúncio", "CTA para aplicação", "Prospecção ativa"],
                },
                {
                  range: "R$5.000+",
                  tier: "Ultra High",
                  items: ["Relacionamento e eventos", "Quase nada de pago frio", "Indicação + parceiros", "Formulário de qualificação", "Presença digital de autoridade"],
                },
              ].map(({ range, tier, items }) => (
                <Card key={tier}>
                  <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[rgba(13,39,114,0.35)]">{range}</p>
                  <p className="mt-1 text-[0.9rem] font-extrabold">{tier}</p>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-[0.75rem] leading-snug text-[rgba(13,39,114,0.65)]">
                        <span className="mt-0.5 font-extrabold text-[var(--eduzz-yellow)]">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* VALUE LADDER */}
        <Section>
          <div className="flex flex-col gap-6">
            <div>
              <Tag>Escada de Valor</Tag>
              <h2 className="mt-3 text-[1.9rem] font-black tracking-tight">Como monetizar em 3 níveis</h2>
              <p className="mt-3 max-w-2xl text-[0.9rem] leading-[1.7] text-[rgba(13,39,114,0.65)]">
                O módulo de growth é também o modelo de expansão de receita do Pagezz.
              </p>
            </div>
            <div className="grid gap-0 overflow-hidden rounded-[20px] border border-[rgba(13,39,114,0.09)] sm:grid-cols-3">
              {[
                { label: "agora", num: "01", title: "A IA te diz o que fazer", desc: "Plano de crescimento personalizado. Canal, funil, cronograma, briefing de criativos.", active: true },
                { label: "próximo", num: "02", title: "A IA faz o ativo por você", desc: "Copy de anúncio gerada. Imagem criada na hora. Roteiro pronto pra gravar.", active: false },
                { label: "futuro", num: "03", title: "A IA gerencia a distribuição", desc: "Integração com Meta Ads, loop fechado com dados reais do Checkout Sun, estratégia que aprende a cada venda.", active: false },
              ].map(({ label, num, title, desc, active }) => (
                <div key={num} className={`p-7 ${active ? "bg-[var(--eduzz-blue)]" : "bg-white border-t sm:border-t-0 sm:border-l border-[rgba(13,39,114,0.09)]"}`}>
                  <p className={`text-[0.62rem] font-bold uppercase tracking-wider ${active ? "text-[rgba(255,193,7,0.6)]" : "text-[rgba(13,39,114,0.35)]"}`}>{label}</p>
                  <p className={`mt-1 text-[2.5rem] font-black leading-none ${active ? "text-[rgba(255,193,7,0.2)]" : "text-[rgba(13,39,114,0.08)]"}`}>{num}</p>
                  <p className={`mt-3 text-[0.9rem] font-extrabold ${active ? "text-[var(--eduzz-yellow)]" : "text-[var(--eduzz-blue)]"}`}>{title}</p>
                  <p className={`mt-2 text-[0.78rem] leading-relaxed ${active ? "text-white/65" : "text-[rgba(13,39,114,0.6)]"}`}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* MOAT */}
        <Section>
          <div className="flex flex-col gap-6">
            <div>
              <Tag>Vantagem Competitiva</Tag>
              <h2 className="mt-3 text-[1.9rem] font-black tracking-tight">Por que só a Eduzz consegue fazer isso</h2>
            </div>
            <div className="grid gap-6 rounded-[24px] bg-[var(--eduzz-blue)] p-8 sm:grid-cols-2">
              <div>
                <h3 className="text-[1.5rem] font-black leading-[1.2] tracking-tight text-white">
                  O dado que a concorrência <em className="not-italic text-[var(--eduzz-yellow)]">não tem.</em>
                </h3>
                <p className="mt-4 text-[0.88rem] leading-[1.7] text-white/60">
                  Qualquer page builder gera HTML. Nenhum deles sabe o que de fato converteu. A Eduzz sabe — e o Growth Module transforma esse dado num produto de IA que fecha o loop entre geração de página e venda real.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { title: "Loop de dados fechado", body: "A IA puxa conversão real do Checkout Sun. Para de chutar e passa a saber o que vendeu. Página → estratégia → venda → estratégia melhor. Flywheel." },
                  { title: "Ecossistema integrado", body: "Produto, checkout (Sun), histórico e perfil do produtor já existem na Eduzz. O Growth começa com tudo carregado — nicho, ticket, audiência — sem pedir o que já se sabe." },
                  { title: "Contexto acumulado", body: "Nicho, produto, ticket e público já estão na página gerada. O Growth começa informado, não do zero. Vantagem de produto real." },
                ].map(({ title, body }) => (
                  <div key={title} className="rounded-xl border-l-[3px] border-[var(--eduzz-yellow)] bg-white/6 p-4 bg-[rgba(255,255,255,0.06)]">
                    <p className="text-[0.75rem] font-extrabold uppercase tracking-wide text-[var(--eduzz-yellow)]">{title}</p>
                    <p className="mt-1.5 text-[0.8rem] leading-relaxed text-white/60">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* AQUISIÇÃO */}
        <Section>
          <div className="rounded-[24px] bg-[var(--eduzz-blue)] p-10 text-center text-white">
            <h2 className="mx-auto max-w-2xl text-[clamp(1.4rem,3vw,2rem)] font-black leading-[1.25] tracking-tight">
              O Growth Module não serve só quem já é usuário.<br />
              <span className="text-[var(--eduzz-yellow)]">Ele atrai quem nunca ouviu falar do Pagezz.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[0.9rem] leading-[1.7] text-white/60">
              Lovable, Framer e Durable geram páginas. Nenhum deles entrega estratégia de divulgação. O produtor que usou essas ferramentas tem um problema que só o Pagezz resolve — e isso é uma cunha de aquisição.
            </p>
          </div>
        </Section>

        {/* CTA FINAL */}
        <Section>
          <div className="rounded-[28px] bg-[var(--eduzz-blue)] p-10 text-center text-white">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-white/40">Pronto pra testar</p>
            <h2 className="mt-3 text-[1.9rem] font-black tracking-tight">O Growth Module está no ar</h2>
            <p className="mx-auto mt-3 max-w-md text-[0.9rem] leading-[1.7] text-white/65">
              De um produto a um plano de crescimento completo. Canal, funil, cronograma, criativos — tudo em uma conversa.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/growth" className="rounded-xl bg-[var(--eduzz-yellow)] px-7 py-3.5 text-sm font-extrabold text-[var(--eduzz-blue)] transition-all hover:-translate-y-0.5">
                → Criar meu plano de growth
              </Link>
              <Link href="/business-case" className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-bold text-white/80 transition-all hover:border-white/40 hover:text-white">
                Ver BC Páginas com Agentes
              </Link>
            </div>
          </div>
        </Section>

      </div>
    </main>
  );
}
