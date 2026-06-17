"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type ModeCardProps = {
  title: string;
  description: string;
  action: string;
  route: string;
  marker: string;
  isNew?: boolean;
};

const workflow = [
  "Produto",
  "Público",
  "Copy",
  "Design",
  "Página",
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="none">
      <path
        d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 28 28" fill="none">
      <path
        d="M15.8 2 6 15h7.2L11.8 26 22 11.6h-7.1L15.8 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 28 28" fill="none">
      <path
        d="M5 7.8A5.8 5.8 0 0 1 10.8 2h6.4A5.8 5.8 0 0 1 23 7.8v4.4a5.8 5.8 0 0 1-5.8 5.8h-4.8l-5.6 4.2a.8.8 0 0 1-1.28-.64l.08-5.1A5.78 5.78 0 0 1 5 12.2V7.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ModeCard({
  title,
  description,
  action,
  route,
  marker,
  isNew,
}: ModeCardProps) {
  const router = useRouter();
  const Icon = marker === "agents" ? SparkIcon : ChatIcon;

  return (
    <button
      onClick={() => router.push(route)}
      className="group flex min-h-[196px] w-full min-w-0 flex-col justify-between rounded-[26px] border border-[#dce2ef] bg-white p-5 text-left shadow-[0_24px_70px_rgba(13,39,114,0.10)] transition duration-300 hover:-translate-y-1 hover:border-[var(--eduzz-yellow)] hover:shadow-[0_28px_90px_rgba(13,39,114,0.18)] focus:outline-none focus:ring-4 focus:ring-[rgba(255,188,0,0.32)]"
    >
      <span className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--eduzz-blue)] text-[var(--eduzz-yellow)]">
          <Icon />
        </span>
        {isNew ? (
          <span className="rounded-full bg-[var(--eduzz-yellow)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--eduzz-blue)]">
            Novo
          </span>
        ) : null}
      </span>

      <span>
        <span className="font-display block text-[22px] font-bold text-[var(--eduzz-blue)]">
          {title}
        </span>
        <span className="mt-3 block max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
          {description}
        </span>
      </span>

      <span className="font-display mt-5 inline-flex min-w-0 items-center gap-2 text-sm font-bold text-[var(--eduzz-blue)]">
        {action}
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--eduzz-yellow)] transition group-hover:translate-x-1">
          <ArrowIcon />
        </span>
      </span>
    </button>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8e8] text-[var(--eduzz-blue)]">
      <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-[var(--eduzz-yellow)]" />
      <div className="absolute -right-28 bottom-0 h-[420px] w-[420px] rounded-full bg-[var(--eduzz-blue)]" />
      <div className="absolute right-20 top-28 h-24 w-24 rounded-full bg-[var(--eduzz-cyan)] opacity-80" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex h-16 items-center justify-between rounded-full border border-white/70 bg-white/78 px-5 shadow-[0_16px_50px_rgba(13,39,114,0.10)] backdrop-blur">
          <div className="flex items-center gap-3">
            <Image
              src="/eduzz-symbol-crop.png"
              alt="Eduzz"
              width={42}
              height={42}
              className="h-10 w-10 object-contain"
              priority
            />
            <div className="leading-none">
              <p className="font-display text-lg font-extrabold tracking-tight">
                Pagezz AI
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgba(13,39,114,0.56)]">
                Eduzz Intelligence
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-[#e0e6f2] bg-[#f7f9ff] p-1 text-xs font-bold uppercase tracking-[0.12em] text-[rgba(13,39,114,0.66)] md:flex">
            <span className="rounded-full bg-[var(--eduzz-blue)] px-4 py-2 text-white">
              Criar
            </span>
            <span className="px-4 py-2">Estratégia</span>
            <span className="px-4 py-2">Página</span>
          </div>

          <span className="hidden rounded-full bg-[var(--eduzz-yellow)] px-5 py-3 text-sm font-extrabold text-[var(--eduzz-blue)] sm:inline-flex">
            IA para vender melhor
          </span>
        </header>

        <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1fr_500px] lg:py-10">
          <div className="relative z-10 max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-[rgba(13,39,114,0.18)] bg-white/75 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--eduzz-blue)]">
              Pagezz AI / Páginas que viram venda
            </p>
            <h1 className="font-display max-w-full break-words text-[clamp(2.25rem,9.5vw,4.8rem)] font-normal leading-[1.05] tracking-normal text-[var(--eduzz-blue)]">
              Crie sua página de venda com inteligência de ponta a ponta.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[rgba(13,39,114,0.74)]">
              Escolha um caminho e deixe a IA organizar estratégia, promessa,
              narrativa e estrutura visual para seu produto digital.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <ModeCard
                marker="agents"
                title="Modo Agentes"
                description="Preencha um briefing rápido e quatro agentes trabalham em sequência para gerar uma página completa."
                action="Começar pelo briefing"
                route="/onboarding"
              />
              <ModeCard
                marker="chat"
                title="Modo Conversa"
                description="Converse com um estrategista de IA e veja sua página tomar forma enquanto você explica o produto."
                action="Começar conversando"
                route="/chat"
                isNew
              />
            </div>
          </div>

          <aside className="relative z-10 rounded-[34px] bg-[var(--eduzz-blue)] p-5 text-white shadow-[0_30px_90px_rgba(13,39,114,0.24)]">
            <div className="rounded-[26px] border border-white/10 bg-white/8 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/54">
                    Motor Pagezz
                  </p>
                  <h2 className="font-display mt-2 text-3xl font-bold">
                    Da ideia ao ar
                  </h2>
                </div>
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--eduzz-yellow)] text-[var(--eduzz-blue)]">
                  <SparkIcon />
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {workflow.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl bg-white p-4 text-[var(--eduzz-blue)]"
                  >
                    <span className="font-display grid h-10 w-10 place-items-center rounded-full bg-[#fff4e1] text-sm font-extrabold">
                      0{index + 1}
                    </span>
                    <span className="font-display text-lg font-bold">
                      {item}
                    </span>
                    <span className="ml-auto h-2 w-16 rounded-full bg-[var(--eduzz-yellow)]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-[24px] bg-white text-[var(--eduzz-blue)]">
              <div className="border-r border-[#e4e8f1] p-5">
                <p className="font-display text-4xl font-extrabold">4</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[rgba(13,39,114,0.58)]">
                  agentes
                </p>
              </div>
              <div className="border-r border-[#e4e8f1] p-5">
                <p className="font-display text-4xl font-extrabold">1</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[rgba(13,39,114,0.58)]">
                  conversa
                </p>
              </div>
              <div className="p-5">
                <p className="font-display text-4xl font-extrabold">AI</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[rgba(13,39,114,0.58)]">
                  página
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
