import Link from "next/link";
import Image from "next/image";

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

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[rgba(13,39,114,0.15)] bg-white/80 px-3.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[rgba(13,39,114,0.55)]">
      {children}
    </span>
  );
}

function Stage({ num, title, agents, desc }: { num: string; title: string; agents: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--eduzz-blue)] text-[0.75rem] font-extrabold text-[var(--eduzz-yellow)]">
        {num}
      </div>
      <div className="flex-1 pb-6 border-l-2 border-dashed border-[rgba(13,39,114,0.12)] pl-4 ml-[-1.25rem] translate-x-5">
        <p className="text-[0.82rem] font-extrabold text-[var(--eduzz-blue)]">{title}</p>
        <p className="mt-0.5 text-[0.68rem] font-bold uppercase tracking-wide text-[rgba(13,39,114,0.4)]">{agents}</p>
        <p className="mt-1.5 text-[0.8rem] leading-relaxed text-[rgba(13,39,114,0.65)]">{desc}</p>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 text-center">
      <p className="text-3xl font-black text-[var(--eduzz-blue)]">{value}</p>
      <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[rgba(13,39,114,0.45)]">{label}</p>
    </div>
  );
}

export default function BusinessCase() {
  return (
    <main className="min-h-screen bg-[#fff8e8] pb-20 text-[var(--eduzz-blue)]" style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>

      {/* NAV */}
      <header className="sticky top-4 z-50 mx-auto max-w-5xl px-5 sm:px-8">
        <div className="flex h-14 items-center justify-between rounded-full border border-white/70 bg-white/90 px-5 shadow-[0_8px_32px_rgba(13,39,114,0.10)] backdrop-blur">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image src="/eduzz-symbol-crop.png" alt="Eduzz" width={34} height={34} className="h-8 w-8 object-contain" />
            <div className="leading-none">
              <p className="text-sm font-extrabold tracking-tight">Pagezz AI</p>
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[rgba(13,39,114,0.45)]">Eduzz Intelligence</p>
            </div>
          </Link>
          <Tag>Business Case</Tag>
          <Link href="/chat" className="rounded-full bg-[var(--eduzz-blue)] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-85">
            Ver protótipo →
          </Link>
        </div>
      </header>

      <div className="mt-8 flex flex-col gap-16">

        {/* HERO */}
        <Section className="pt-10">
          <div className="flex flex-col items-center gap-5 text-center">
            <Tag>Business Case · Pagezz AI · Jun 2026</Tag>
            <h1
              className="max-w-3xl text-[clamp(1.9rem,5.5vw,3.4rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[var(--eduzz-blue)]"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              O primeiro motor de IA<br />para páginas de venda<br />em português
            </h1>
            <p className="max-w-xl text-[0.95rem] leading-[1.7] text-[rgba(13,39,114,0.65)]">
              Uma conversa substitui semanas de briefing, copywriting e design. O Pagezz AI transforma o que um produtor sabe sobre seu produto num HTML exportável — pronto para subir hoje.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href="/chat" className="flex items-center gap-2 rounded-xl bg-[var(--eduzz-blue)] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90">
                → Testar o protótipo
              </Link>
              <a href="#pipeline" className="flex items-center gap-2 rounded-xl border border-[rgba(13,39,114,0.18)] bg-white px-6 py-3 text-sm font-bold text-[var(--eduzz-blue)] transition-all hover:-translate-y-0.5">
                Ver como funciona
              </a>
            </div>
          </div>
        </Section>

        {/* STATS STRIP */}
        <Section>
          <Card className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat value="5" label="Estágios do pipeline" />
            <Stat value="12" label="Tipos de página" />
            <Stat value="~15s" label="Tempo de geração" />
            <Stat value="100%" label="Protótipo funcional" />
          </Card>
        </Section>

        {/* PROBLEMA */}
        <Section>
          <div className="flex flex-col gap-6">
            <div>
              <Tag>O Problema</Tag>
              <h2 className="mt-3 text-[1.9rem] font-black tracking-tight">Criar uma página de vendas é caro, lento e especializado</h2>
              <p className="mt-3 max-w-2xl text-[0.9rem] leading-[1.7] text-[rgba(13,39,114,0.65)]">
                No ecossistema de info-produtos brasileiro, a página de vendas é o ativo central — é ela que converte ou não. Mas produzi-la exige uma cadeia cara de especialistas e semanas de iteração.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: "💸", title: "Custo", body: "Um copywriter especializado em alta conversão cobra R$3.000–R$15.000 por página. Fora o design e a programação." },
                { icon: "⏳", title: "Tempo", body: "Da reunião de briefing à página no ar: 2 a 6 semanas em média. Cada iteração de copy adiciona mais dias." },
                { icon: "🎯", title: "Acesso", body: "Produtores iniciantes e de médio ticket simplesmente não têm budget para contratar os especialistas certos. Fazem com o que podem — e convertem pouco." },
              ].map(({ icon, title, body }) => (
                <Card key={title}>
                  <p className="text-2xl">{icon}</p>
                  <p className="mt-3 text-[0.9rem] font-extrabold">{title}</p>
                  <p className="mt-1.5 text-[0.8rem] leading-relaxed text-[rgba(13,39,114,0.6)]">{body}</p>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* MERCADO */}
        <Section>
          <div className="flex flex-col gap-6">
            <div>
              <Tag>Mercado</Tag>
              <h2 className="mt-3 text-[1.9rem] font-black tracking-tight">Brasil: 3° maior mercado de info-produtos do mundo</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="flex flex-col gap-4">
                <p className="text-[0.72rem] font-bold uppercase tracking-wider text-[rgba(13,39,114,0.4)]">Mercado global</p>
                {[
                  ["Mercado global e-learning 2024", "R$ 600 bi+"],
                  ["Crescimento anual (CAGR)", "~14%"],
                  ["Info-produtos digitais Brasil", "Top 3 mundial"],
                  ["Produtores ativos no Brasil", "1 M+"],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex items-center justify-between border-b border-[rgba(13,39,114,0.07)] pb-3 last:border-0 last:pb-0">
                    <span className="text-[0.8rem] text-[rgba(13,39,114,0.65)]">{label}</span>
                    <span className="text-[0.85rem] font-extrabold">{val}</span>
                  </div>
                ))}
              </Card>
              <Card className="flex flex-col gap-4 bg-[var(--eduzz-blue)] text-white">
                <p className="text-[0.72rem] font-bold uppercase tracking-wider text-white/40">Contexto Eduzz</p>
                {[
                  ["Produtores na plataforma", "100k+"],
                  ["Transações processadas", "Bilhões R$"],
                  ["Nicho principal", "Info-produtos BR"],
                  ["Dor mapeada", "Conversão"],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-[0.8rem] text-white/60">{label}</span>
                    <span className="text-[0.85rem] font-extrabold text-[var(--eduzz-yellow)]">{val}</span>
                  </div>
                ))}
              </Card>
            </div>
            <Card className="bg-[var(--eduzz-yellow)]/15 border-[var(--eduzz-yellow)]/40">
              <p className="text-[0.82rem] font-extrabold">Oportunidade direta</p>
              <p className="mt-1.5 text-[0.8rem] leading-relaxed text-[rgba(13,39,114,0.7)]">
                De 100k+ produtores na Eduzz, uma fração expressiva não tem página de vendas profissional — ou tem uma página que não converte. O Pagezz AI ataca exatamente esse gap: produtores que sabem o que vendem mas não sabem como apresentar.
              </p>
            </Card>
          </div>
        </Section>

        {/* PIPELINE */}
        <Section id="pipeline">
          <div className="flex flex-col gap-6">
            <div>
              <Tag>A Solução</Tag>
              <h2 className="mt-3 text-[1.9rem] font-black tracking-tight">Pipeline de 5 estágios: da conversa ao HTML</h2>
              <p className="mt-3 max-w-2xl text-[0.9rem] leading-[1.7] text-[rgba(13,39,114,0.65)]">
                Nenhuma tela de formulário. O produtor conversa com a IA como falaria com um estrategista de agência — e sai com a página pronta.
              </p>
            </div>
            <div className="grid gap-0 sm:grid-cols-[1fr_1fr]">
              <Card className="rounded-r-none border-r-0 sm:rounded-r-none">
                <div className="flex flex-col gap-0">
                  <Stage
                    num="01"
                    title="Discovery"
                    agents="intake · market · product"
                    desc="Conversa estratégica sem roteiro fixo. A IA descobre nicho, público, promessa, objeções e ticket. Termina quando sabe o suficiente."
                  />
                  <Stage
                    num="02"
                    title="Estratégia"
                    agents="copyStrategy · pageTypeRecommender"
                    desc="Recomenda o tipo de página ideal (VSL, venda direta, aplicação...), define promessa central, arco emocional e elementos de conversão."
                  />
                  <Stage
                    num="03"
                    title="Briefing Room"
                    agents="briefingOrchestrator"
                    desc="Coleta materiais: depoimentos, imagem hero, bônus. Placeholders inteligentes por nicho — nenhum campo bloqueia a geração."
                  />
                </div>
              </Card>
              <Card className="rounded-l-none border-l-0 sm:rounded-l-none bg-[var(--eduzz-blue)] text-white">
                <div className="flex flex-col gap-0">
                  <Stage
                    num="04"
                    title="Geração"
                    agents="pageWriterHtml (Cerebras / Z.AI)"
                    desc="Gera HTML completo em ~15s. Regras anti-invenção (seção some se não há dados), preço exposto só no ticket certo, widgets de conversão injetados."
                  />
                  <Stage
                    num="05"
                    title="Refinamento"
                    agents="refineHtml"
                    desc="Edição cirúrgica por instrução: 'altere só o botão de CTA'. O resto permanece intacto. Preview em iframe, copiar ou baixar HTML."
                  />
                  <div className="mt-2 rounded-xl bg-white/10 p-4">
                    <p className="text-[0.72rem] font-bold uppercase tracking-wider text-white/40">Output final</p>
                    <p className="mt-1 text-[0.9rem] font-extrabold text-[var(--eduzz-yellow)]">HTML exportável · pronto para subir</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Section>

        {/* STACK TÉCNICA */}
        <Section>
          <div className="flex flex-col gap-6">
            <div>
              <Tag>Stack & Diferenciais Técnicos</Tag>
              <h2 className="mt-3 text-[1.9rem] font-black tracking-tight">Duas camadas de IA isoladas por design</h2>
              <p className="mt-3 max-w-2xl text-[0.9rem] leading-[1.7] text-[rgba(13,39,114,0.65)]">
                Uma falha de cota num provedor não derruba o outro. Cada camada tem fallback automático.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <p className="text-[0.72rem] font-bold uppercase tracking-wider text-[rgba(13,39,114,0.4)]">Camada de Agentes (raciocínio)</p>
                <p className="mt-2 text-[0.85rem] font-extrabold">OpenRouter → Gemini 2.0 Flash → Groq Llama 3.3 70B</p>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-[rgba(13,39,114,0.6)]">Usado em discovery, estratégia, briefing. Fallback automático na ordem. Troca de modelo 100% por env.</p>
              </Card>
              <Card>
                <p className="text-[0.72rem] font-bold uppercase tracking-wider text-[rgba(13,39,114,0.4)]">Camada de Geração HTML</p>
                <p className="mt-2 text-[0.85rem] font-extrabold">Cerebras zai-glm-4.7 → Z.AI glm-4.7-flash</p>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-[rgba(13,39,114,0.6)]">Isolada dos agentes. Retry em 429 com backoff. ~9–16s por página completa. Slot 100% trocável por env.</p>
              </Card>
              <Card className="sm:col-span-2">
                <p className="text-[0.72rem] font-bold uppercase tracking-wider text-[rgba(13,39,114,0.4)]">App</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Next.js 16 + App Router", "TypeScript", "Tailwind CSS v4", "React 19", "Framer Motion", "SSE Streaming", "Vercel (gru1 — São Paulo)", "Supabase (scaffolded)"].map((t) => (
                    <span key={t} className="rounded-lg bg-[rgba(13,39,114,0.06)] px-3 py-1.5 text-[0.75rem] font-semibold">{t}</span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </Section>

        {/* STATUS ATUAL */}
        <Section>
          <div className="flex flex-col gap-6">
            <div>
              <Tag>Status Atual · Jun 2026</Tag>
              <h2 className="mt-3 text-[1.9rem] font-black tracking-tight">Protótipo funcional 100% operacional</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { done: true, label: "Pipeline de 5 estágios completo", detail: "Discovery → Estratégia → Briefing → Geração → Refinamento" },
                { done: true, label: "12 tipos de página suportados", detail: "VSL, venda direta, captura, webinar, high-ticket, lançamento..." },
                { done: true, label: "Geração de HTML em ~15s", detail: "Cerebras com fallback Z.AI, retry automático" },
                { done: true, label: "Dois modelos de IA isolados", detail: "Falha de um não afeta o outro" },
                { done: true, label: "Widgets de conversão injetados", detail: "Countdown, social proof toast, sticky CTA — theme-aware" },
                { done: true, label: "Histórico de conversas", detail: "Persistência em localStorage, exportação de HTML" },
                { done: false, label: "Autenticação Supabase", detail: "Scaffolded — implementação pendente" },
                { done: false, label: "Planejar Divulgação (Growth)", detail: "Caminho paralelo no roadmap" },
              ].map(({ done, label, detail }) => (
                <div key={label} className={`flex items-start gap-3 rounded-xl border p-4 ${done ? "border-green-200 bg-green-50" : "border-[rgba(13,39,114,0.1)] bg-white"}`}>
                  <span className={`mt-0.5 text-lg ${done ? "text-green-500" : "text-[rgba(13,39,114,0.25)]"}`}>{done ? "✓" : "○"}</span>
                  <div>
                    <p className="text-[0.82rem] font-extrabold">{label}</p>
                    <p className="mt-0.5 text-[0.72rem] text-[rgba(13,39,114,0.5)]">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* PRÓXIMOS PASSOS */}
        <Section>
          <div className="flex flex-col gap-6">
            <div>
              <Tag>Próximos Passos</Tag>
              <h2 className="mt-3 text-[1.9rem] font-black tracking-tight">Roadmap de lançamento</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { phase: "Fase 1", title: "Validação", items: ["Testes com produtores Eduzz", "Métricas de conversão das páginas geradas", "Iteração de prompts por nicho"] },
                { phase: "Fase 2", title: "Produto", items: ["Auth Supabase + contas", "Dashboard de projetos salvos", "Templates por vertical (saúde, negócios, mindset...)"] },
                { phase: "Fase 3", title: "Escala", items: ["Integração marketplace Eduzz", "Growth planner (canal + funil + criativos)", "API para produtores avançados"] },
              ].map(({ phase, title, items }) => (
                <Card key={phase}>
                  <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[rgba(13,39,114,0.35)]">{phase}</p>
                  <p className="mt-1 text-[1rem] font-extrabold">{title}</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[0.78rem] leading-snug text-[rgba(13,39,114,0.65)]">
                        <span className="mt-0.5 text-[var(--eduzz-yellow)] font-extrabold">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA FINAL */}
        <Section>
          <div className="rounded-[28px] bg-[var(--eduzz-blue)] p-10 text-center text-white">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-white/40">Pronto pra testar</p>
            <h2 className="mt-3 text-[1.9rem] font-black tracking-tight">O protótipo está no ar</h2>
            <p className="mx-auto mt-3 max-w-md text-[0.9rem] leading-[1.7] text-white/65">
              De um produto a uma página de vendas profissional em menos de 10 minutos. Nenhum copywriter. Nenhum designer. Só uma conversa.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/chat" className="rounded-xl bg-[var(--eduzz-yellow)] px-7 py-3.5 text-sm font-extrabold text-[var(--eduzz-blue)] transition-all hover:-translate-y-0.5">
                → Criar minha página agora
              </Link>
              <Link href="/" className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-bold text-white/80 transition-all hover:border-white/40 hover:text-white">
                ← Voltar ao início
              </Link>
            </div>
          </div>
        </Section>

      </div>
    </main>
  );
}
