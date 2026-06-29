"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const PAGE_STEPS = ["Descoberta", "Estratégia", "Briefing", "Geração", "Refino"];
const GROWTH_STEPS = ["Discovery", "Canal de divulgação", "Funil e testes A/B", "Plano semanal", "Criativos prontos"];

type Path = "page" | "growth";

function ArrowIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20" fill="none">
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" viewBox="0 0 28 28" fill="none">
      <path d="M15.8 2 6 15h7.2L11.8 26 22 11.6h-7.1L15.8 2Z" fill="currentColor" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [activePath, setActivePath] = useState<Path>("page");
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setActiveStep(0);
    const t = setInterval(() => setActiveStep((s) => (s + 1) % 5), 1900);
    return () => clearInterval(t);
  }, [activePath]);

  const steps = activePath === "page" ? PAGE_STEPS : GROWTH_STEPS;
  const motorTitle = activePath === "page" ? "Da ideia ao ar" : "Da página à venda";
  const statVal = activePath === "page" ? "1" : "3";
  const statLabel = activePath === "page" ? "página" : "criativos";

  function selectPath(p: Path) {
    if (p !== activePath) setActivePath(p);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8e8] text-[var(--eduzz-blue)]" style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-[var(--eduzz-yellow)]" />
      <div className="absolute -right-28 bottom-0 h-[420px] w-[420px] rounded-full bg-[var(--eduzz-blue)] opacity-10" />
      <div className="absolute right-20 top-28 h-24 w-24 rounded-full bg-[var(--eduzz-cyan)] opacity-80" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">

        {/* NAV */}
        <header className="flex h-16 items-center justify-between rounded-full border border-white/70 bg-white/80 px-5 shadow-[0_16px_50px_rgba(13,39,114,0.10)] backdrop-blur">
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
              <p className="text-lg font-extrabold tracking-tight">Pagezz AI</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgba(13,39,114,0.56)]">Eduzz Intelligence</p>
            </div>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/business-case-growth" className="rounded-full px-3.5 py-2 text-[0.68rem] font-bold tracking-[0.3px] text-[rgba(13,39,114,0.75)] transition-colors hover:bg-[rgba(13,39,114,0.06)] hover:text-[var(--eduzz-blue)]">BC Growth com Agentes</Link>
            <Link href="/business-case" className="rounded-full px-3.5 py-2 text-[0.68rem] font-bold tracking-[0.3px] text-[rgba(13,39,114,0.75)] transition-colors hover:bg-[rgba(13,39,114,0.06)] hover:text-[var(--eduzz-blue)]">BC Páginas com Agentes</Link>
          </nav>

          <div />
        </header>

        {/* HERO */}
        <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1fr_480px] lg:py-10">

          {/* LEFT */}
          <div className="relative z-10 flex flex-col gap-4">
            <p className="inline-flex w-fit rounded-full border border-[rgba(13,39,114,0.18)] bg-white/75 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em]">
              Pagezz AI · Páginas que viram venda
            </p>

            <h1 className="max-w-lg text-[clamp(2.4rem,7vw,4rem)] font-black leading-[1.04] tracking-[-0.04em]">
              Página pronta.<br />
              Estratégia<br />
              na mão.
            </h1>

            <p className="max-w-[340px] text-[0.9rem] leading-[1.65] text-[rgba(13,39,114,0.68)]">
              Crie sua página de vendas com IA — ou chegue com a sua. A IA descobre seu negócio, monta a estratégia e entrega{" "}
              <strong className="font-semibold text-[var(--eduzz-blue)]">um plano de divulgação pronto pra executar.</strong>
            </p>

            {/* PATH CARDS */}
            <div className="grid max-w-[340px] grid-cols-2 gap-2.5">
              {/* Criar página — built */}
              <button
                onClick={() => selectPath("page")}
                aria-pressed={activePath === "page"}
                className={`flex flex-col gap-2.5 rounded-xl border-[1.5px] bg-white p-3.5 text-left transition-all duration-150 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--eduzz-blue)] ${
                  activePath === "page"
                    ? "border-[var(--eduzz-blue)]"
                    : "border-[rgba(13,39,114,0.12)] hover:border-[rgba(13,39,114,0.28)]"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--eduzz-blue)] text-[var(--eduzz-yellow)]">
                  <FileIcon />
                </div>
                <div className="text-[0.8rem] font-bold leading-tight">Criar minha página</div>
                <div className="text-[0.66rem] leading-snug text-gray-400">Uma conversa. IA descobre, estrategiza e entrega.</div>
                <div className="flex items-center justify-between">
                  <span className="text-[0.63rem] font-bold">Começar agora</span>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full bg-[var(--eduzz-yellow)] text-[var(--eduzz-blue)] transition-transform duration-150 ${activePath === "page" ? "translate-x-0.5" : ""}`}>
                    <ArrowIcon />
                  </span>
                </div>
              </button>

              {/* Planejar divulgação — em breve */}
              <button
                onClick={() => selectPath("growth")}
                aria-pressed={activePath === "growth"}
                className={`relative flex flex-col gap-2.5 rounded-xl border-[1.5px] bg-white p-3.5 text-left transition-all duration-150 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--eduzz-blue)] ${
                  activePath === "growth"
                    ? "border-[var(--eduzz-blue)]"
                    : "border-[rgba(13,39,114,0.12)] hover:border-[rgba(13,39,114,0.28)]"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--eduzz-yellow)] text-[var(--eduzz-blue)]">
                  <TrendingIcon />
                </div>
                <div className="text-[0.8rem] font-bold leading-tight">Planejar divulgação</div>
                <div className="text-[0.66rem] leading-snug text-gray-400">Já tem a página. A IA monta canal, funil e criativos.</div>
                <div className="flex items-center justify-between">
                  <span className="text-[0.63rem] font-bold">Começar agora</span>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full bg-[var(--eduzz-yellow)] text-[var(--eduzz-blue)] transition-transform duration-150 ${activePath === "growth" ? "translate-x-0.5" : ""}`}>
                    <ArrowIcon />
                  </span>
                </div>
              </button>
            </div>

            {/* CTA ROW */}
            <div className="flex items-center gap-4">
              {activePath === "page" ? (
                <button
                  onClick={() => router.push("/chat")}
                  className="flex items-center gap-2 rounded-[10px] bg-[var(--eduzz-blue)] px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--eduzz-blue)] focus-visible:ring-offset-2"
                >
                  <ArrowIcon />
                  Criar minha página
                </button>
              ) : (
                <button
                  onClick={() => router.push("/growth")}
                  className="flex items-center gap-2 rounded-[10px] bg-[var(--eduzz-blue)] px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--eduzz-blue)] focus-visible:ring-offset-2"
                >
                  <ArrowIcon />
                  Planejar divulgação
                </button>
              )}

              {activePath === "page" ? (
                <button
                  onClick={() => selectPath("growth")}
                  className="border-b border-[rgba(13,39,114,0.2)] pb-px text-xs font-semibold text-[rgba(13,39,114,0.5)] transition-colors hover:text-[var(--eduzz-blue)]"
                >
                  ou planejar divulgação
                </button>
              ) : (
                <button
                  onClick={() => selectPath("page")}
                  className="border-b border-[rgba(13,39,114,0.2)] pb-px text-xs font-semibold text-[rgba(13,39,114,0.5)] transition-colors hover:text-[var(--eduzz-blue)]"
                >
                  ou criar página primeiro
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — MOTOR PAGEZZ */}
          <aside
            className="relative z-10 rounded-[28px] bg-[var(--eduzz-blue)] p-5 text-white shadow-[0_30px_90px_rgba(13,39,114,0.24)]"
            role="region"
            aria-label="Motor Pagezz — pipeline de IA"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/40">Motor Pagezz</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight">{motorTitle}</h2>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--eduzz-yellow)] text-[var(--eduzz-blue)]">
                <SparkIcon />
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[var(--eduzz-blue)] transition-transform duration-150 ${activeStep === i ? "scale-[1.02]" : ""}`}
                >
                  <span className="w-6 shrink-0 text-[10px] font-extrabold text-gray-300 tabular-nums">0{i + 1}</span>
                  <span className="flex-1 text-[0.82rem] font-semibold">{step}</span>
                  <span className="relative h-[3px] w-7 shrink-0 overflow-hidden rounded-full bg-[rgba(13,39,114,0.08)]">
                    <span
                      className={`absolute inset-y-0 left-0 rounded-full bg-[var(--eduzz-yellow)] transition-all duration-500 ease-in-out ${
                        activeStep === i ? "w-full" : "w-0"
                      }`}
                    />
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-[18px] bg-white text-[var(--eduzz-blue)]">
              <div className="border-r border-[#e4e8f1] p-4">
                <p className="text-3xl font-extrabold tabular-nums">5</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[rgba(13,39,114,0.5)]">etapas</p>
              </div>
              <div className="border-r border-[#e4e8f1] p-4">
                <p className="text-3xl font-extrabold">IA</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[rgba(13,39,114,0.5)]">multi-agente</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-extrabold tabular-nums">{statVal}</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[rgba(13,39,114,0.5)]">{statLabel}</p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
