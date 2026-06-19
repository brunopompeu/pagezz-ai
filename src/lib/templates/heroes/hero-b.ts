import type { StructureName } from '../types'

export function heroB(structure: StructureName): { css: string; html: string } {
  switch (structure) {
    case 'low-ticket': return lowTicketHeroB()
    case 'authority': return authorityHeroB()
    case 'qualification': return qualificationHeroB()
    default: return lowTicketHeroB()
  }
}

// ─── LOW TICKET — Hero B: Full-width layered bg, avatar centralizado ──────────

function lowTicketHeroB(): { css: string; html: string } {
  const css = `
.urgency-bar {
  background: var(--primary);
  color: #fff;
  text-align: center;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
}
.urgency-bar strong { font-weight: 800; }
.hero {
  position: relative;
  min-height: 96vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 24px;
  overflow: hidden;
  background: var(--bg-dark);
}
.hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(var(--primary-rgb,.28), .28) 0%, transparent 70%),
    radial-gradient(ellipse 60% 40% at 80% 100%, rgba(var(--primary-rgb,.15), .15) 0%, transparent 60%);
}
.hero-bg-grid {
  position: absolute; inset: 0; z-index: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
  background-size: 48px 48px;
}
.hero-bg-glow {
  position: absolute;
  width: 500px; height: 500px;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--primary-rgb,.12), .12) 0%, transparent 70%);
  z-index: 0;
}
.hero-overlay {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,.55) 100%);
}
.hero-content {
  position: relative; z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 760px;
  width: 100%;
}
.hero-avatar {
  position: relative;
  width: 120px; height: 120px;
  border-radius: 50%;
  background: #1E1E1E;
  border: 3px solid var(--primary);
  overflow: hidden;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.avatar-silhueta {
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 65%; height: 90%;
  background: linear-gradient(180deg, rgba(80,80,80,.25) 0%, rgba(50,50,50,.4) 100%);
  clip-path: polygon(25% 0%, 75% 0%, 90% 100%, 10% 100%);
}
.avatar-icon { font-size: 18px; opacity: .3; position: relative; z-index: 1; }
.hero-eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 16px;
}
.hero-title {
  font-family: var(--font-headline);
  font-size: clamp(30px, 4.5vw, 60px);
  font-weight: 800;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 20px;
}
.hero-sub {
  font-size: 17px;
  color: var(--text-2);
  line-height: 1.65;
  margin-bottom: 36px;
  max-width: 560px;
}
.hero-price-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}
.price-de {
  font-size: 15px;
  color: var(--text-2);
  text-decoration: line-through;
}
.price-main {
  font-family: var(--font-headline);
  font-size: 52px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}
.price-parcela {
  font-size: 13px;
  color: var(--text-2);
  display: block;
  text-align: center;
  margin-bottom: 28px;
  margin-top: -20px;
}
.btn-cta {
  display: inline-block;
  background: var(--primary);
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  padding: 20px 48px;
  border-radius: 8px;
  text-decoration: none;
  transition: background .2s, transform .1s;
  box-shadow: 0 4px 32px rgba(0,0,0,.35);
}
.btn-cta:hover { background: var(--primary-dk); transform: translateY(-2px); }
.hero-proof {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
  padding: 16px 24px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 100px;
  backdrop-filter: blur(8px);
}
.hp-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.hp-num {
  font-family: var(--font-headline);
  font-size: 20px;
  font-weight: 800;
  color: var(--primary);
}
.hp-label { font-size: 11px; color: var(--text-2); white-space: nowrap; }
.hp-sep { width: 1px; height: 32px; background: rgba(255,255,255,.1); }
@media (max-width: 640px) {
  .price-main { font-size: 40px; }
  .hero-proof { flex-direction: column; border-radius: 16px; gap: 12px; }
  .hp-sep { width: 40px; height: 1px; }
}
`

  const html = `
<div class="urgency-bar">
  🔥 <strong>{{URGENCIA}}</strong>
</div>
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-bg-grid"></div>
  <div class="hero-bg-glow"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-avatar">
      {{HERO_IMAGE_HTML}}
      <div class="avatar-silhueta"></div>
      <span class="avatar-icon">📸</span>
    </div>
    <p class="hero-eyebrow">{{PRODUTO}}</p>
    <h1 class="hero-title">{{HEADLINE}}</h1>
    <p class="hero-sub">{{SUBHEADLINE}}</p>
    <div class="hero-price-row">
      <span class="price-de">{{PRECO_DE}}</span>
      <span class="price-main">{{PRECO}}</span>
    </div>
    <span class="price-parcela">ou {{PARCELAMENTO}}</span>
    <a href="#comprar" class="btn-cta">{{TEXTO_CTA}}</a>
    <div class="hero-proof">
      <div class="hp-item">
        <span class="hp-num" data-suggested="true">{{STAT_1_NUM}}</span>
        <span class="hp-label">{{STAT_1_LABEL}}</span>
      </div>
      <div class="hp-sep"></div>
      <div class="hp-item">
        <span class="hp-num" data-suggested="true">{{STAT_2_NUM}}</span>
        <span class="hp-label">{{STAT_2_LABEL}}</span>
      </div>
      <div class="hp-sep"></div>
      <div class="hp-item">
        <span class="hp-num">{{STAT_3_NUM}}</span>
        <span class="hp-label">{{STAT_3_LABEL}}</span>
      </div>
    </div>
  </div>
</section>
`
  return { css, html }
}

// ─── AUTHORITY — Hero B: Full hero + avatar circular com anéis + num-cards ────

function authorityHeroB(): { css: string; html: string } {
  const css = `
.topbar {
  position: absolute;
  top: 0; left: 0; right: 0;
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  border-bottom: 1px solid rgba(255,255,255,.06);
}
.topbar-name {
  font-family: var(--font-headline);
  font-size: 17px;
  font-weight: 700;
  color: #fff;
}
.topbar-cta {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
}
.topbar-cta:hover { opacity: .75; }
.hero {
  background: var(--bg-dark);
  position: relative;
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 24px 80px;
  overflow: hidden;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  width: 100%;
  max-width: 1100px;
}
.hero-left-b { display: flex; flex-direction: column; gap: 36px; }
.hero-tag-b {
  display: flex; align-items: center; gap: 14px;
}
.hero-tag-b::before {
  content: '';
  display: block;
  width: 40px; height: 2px;
  background: var(--primary);
  flex-shrink: 0;
}
.hero-tag-b span {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--primary);
}
.hero-title {
  font-family: var(--font-headline);
  font-size: clamp(28px, 3vw, 46px);
  font-weight: 800;
  line-height: 1.1;
  color: #fff;
}
.hero-title em { font-style: italic; color: var(--primary); }
.num-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.num-card {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 8px;
  padding: 20px;
}
.nc-val {
  font-family: var(--font-headline);
  font-size: 30px;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 4px;
}
.nc-label { font-size: 12px; color: rgba(255,255,255,.5); line-height: 1.4; }
.btn-cta {
  display: inline-block;
  padding: 16px 36px;
  border: 1px solid rgba(255,255,255,.2);
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  border-radius: 4px;
  text-decoration: none;
  transition: all .2s;
  width: fit-content;
}
.btn-cta:hover { border-color: var(--primary); color: var(--primary); }
.hero-right-b {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}
.avatar-wrap {
  position: relative;
  width: 200px; height: 200px;
  display: flex; align-items: center; justify-content: center;
}
.avatar-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(var(--primary-rgb,.15), .15);
}
.avatar-ring-1 { inset: -20px; }
.avatar-ring-2 { inset: -36px; }
.avatar-ring-3 { inset: -52px; }
.avatar-circle {
  width: 200px; height: 200px;
  border-radius: 50%;
  border: 2px solid var(--primary);
  overflow: hidden;
  background: #1A1A1A;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  z-index: 2;
}
.avatar-sil {
  width: 55%; height: 85%;
  background: linear-gradient(180deg, rgba(90,90,90,.25) 0%, rgba(55,55,55,.35) 100%);
  clip-path: polygon(25% 0%, 75% 0%, 90% 100%, 10% 100%);
  position: relative;
}
.avatar-empty {
  position: absolute;
  bottom: 16px; left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: 11px;
  color: rgba(255,255,255,.2);
  white-space: nowrap;
}
.media-strip {
  background: rgba(255,255,255,.02);
  border-top: 1px solid rgba(255,255,255,.06);
  padding: 22px 0;
}
.media-strip-inner {
  display: flex; align-items: center; gap: 28px; flex-wrap: wrap;
}
.media-label {
  font-size: 11px;
  color: rgba(255,255,255,.3);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  white-space: nowrap;
}
.media-logos { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; }
.media-logo {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255,255,255,.2);
  letter-spacing: 1px;
  text-transform: uppercase;
}
@media (max-width: 768px) {
  .hero { min-height: auto; padding: 100px 20px 60px; }
  .hero-grid { grid-template-columns: 1fr; gap: 40px; }
  .hero-right-b { display: none; }
  .num-cards { grid-template-columns: 1fr 1fr; }
  .topbar { padding: 16px 20px; }
}
`

  const html = `
<div class="topbar">
  <div class="topbar-name">{{NOME_PRODUTOR}}</div>
  <a href="#contato" class="topbar-cta">Agendar conversa →</a>
</div>
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-left-b">
      <div class="hero-tag-b"><span>{{NICHO}}</span></div>
      <h1 class="hero-title">{{HEADLINE}}</h1>
      <div class="num-cards">
        <div class="num-card">
          <div class="nc-val" data-suggested="true">{{NUM_ANOS}}</div>
          <div class="nc-label">anos de experiência</div>
        </div>
        <div class="num-card">
          <div class="nc-val" data-suggested="true">{{NUM_CLIENTES}}</div>
          <div class="nc-label">clientes atendidos</div>
        </div>
        <div class="num-card">
          <div class="nc-val" data-suggested="true">{{NUM_RESULTADO}}</div>
          <div class="nc-label">{{LABEL_RESULTADO}}</div>
        </div>
        <div class="num-card">
          <div class="nc-val" data-suggested="true">{{NUM_EXTRA}}</div>
          <div class="nc-label">{{LABEL_EXTRA}}</div>
        </div>
      </div>
      <a href="#contato" class="btn-cta">{{TEXTO_CTA}}</a>
    </div>
    <div class="hero-right-b">
      <div class="avatar-wrap">
        <div class="avatar-ring avatar-ring-1"></div>
        <div class="avatar-ring avatar-ring-2"></div>
        <div class="avatar-ring avatar-ring-3"></div>
        <div class="avatar-circle">
          {{HERO_IMAGE_HTML}}
          <div class="avatar-sil"></div>
          <span class="avatar-empty">📸 Adicione foto</span>
        </div>
      </div>
    </div>
  </div>
</section>
<div class="media-strip">
  <div class="container media-strip-inner">
    <span class="media-label">Visto em</span>
    <div class="media-logos">
      <span class="media-logo" data-suggested="true">{{MIDIA_1}}</span>
      <span class="media-logo" data-suggested="true">{{MIDIA_2}}</span>
      <span class="media-logo" data-suggested="true">{{MIDIA_3}}</span>
      <span class="media-logo" data-suggested="true">{{MIDIA_4}}</span>
    </div>
  </div>
</div>
`
  return { css, html }
}

// ─── QUALIFICATION — Hero B: Full-width centrado, problemas 2×2 + formulário ──

function qualificationHeroB(): { css: string; html: string } {
  const css = `
.topbar-nav {
  background: rgba(11,25,41,.95);
  border-bottom: 1px solid rgba(255,255,255,.06);
  padding: 16px 0;
  position: sticky;
  top: 0; z-index: 100;
}
.topbar-nav-inner {
  display: flex; align-items: center; justify-content: space-between;
}
.logo-dot {
  display: flex; align-items: center; gap: 8px;
  font-size: 15px; font-weight: 700; color: #fff;
}
.logo-dot::before {
  content: '';
  display: block;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--primary);
}
.hero {
  background: var(--bg-dark);
  position: relative;
  padding: 80px 0;
  text-align: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(30,111,217,.25) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 80% 100%, rgba(30,111,217,.12) 0%, transparent 60%);
}
.hero-content { position: relative; z-index: 1; }
.hero-badge {
  display: inline-flex;
  align-items: center; gap: 8px;
  border: 1px solid rgba(30,111,217,.4);
  color: var(--accent);
  background: rgba(30,111,217,.1);
  font-size: 12px; font-weight: 600;
  letter-spacing: 1px; text-transform: uppercase;
  padding: 6px 14px; border-radius: 4px;
  margin-bottom: 24px;
}
.hero-title {
  font-family: var(--font-headline);
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 800;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 16px;
  max-width: 780px;
  margin-left: auto;
  margin-right: auto;
}
.hero-sub {
  font-size: 17px;
  color: var(--text-2);
  line-height: 1.65;
  margin-bottom: 48px;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}
.problems-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-width: 660px;
  margin: 0 auto 32px;
  text-align: left;
}
.problem-card {
  display: flex; gap: 14px; align-items: flex-start;
  padding: 16px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 8px;
}
.problem-icon { font-size: 20px; flex-shrink: 0; }
.problem-text { font-size: 13px; color: rgba(255,255,255,.7); line-height: 1.55; }
.if-yes {
  display: inline-block;
  margin: 0 auto 40px;
  padding: 12px 20px;
  background: rgba(30,111,217,.12);
  border: 1px solid rgba(30,111,217,.25);
  border-radius: 8px;
  font-size: 14px;
  color: var(--accent);
}
.form-section {
  max-width: 480px; margin: 0 auto;
}
.form-title {
  font-family: var(--font-headline);
  font-size: 22px; font-weight: 700;
  color: #fff; margin-bottom: 8px; line-height: 1.3;
}
.form-sub { font-size: 14px; color: var(--text-2); margin-bottom: 24px; line-height: 1.55; }
.form-card {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 12px;
  padding: 32px 28px;
  text-align: left;
}
.form-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.form-label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,.6); }
.form-input, .form-select {
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  color: #fff; border-radius: 6px;
  padding: 11px 14px; font-size: 14px; width: 100%;
  outline: none; font-family: inherit;
}
.form-input::placeholder { color: rgba(255,255,255,.3); }
.form-input:focus, .form-select:focus { border-color: var(--primary); }
.form-select option { background: #0F2035; }
.form-submit {
  width: 100%;
  background: var(--primary); color: #fff;
  border: none; border-radius: 8px;
  padding: 16px; font-size: 16px; font-weight: 700;
  cursor: pointer; margin-top: 8px;
  transition: background .2s, transform .1s; font-family: inherit;
}
.form-submit:hover { background: var(--primary-dk); transform: translateY(-1px); }
.form-footer {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 12px; margin-top: 20px;
}
.garantia-box, .disclaimer-box {
  padding: 14px;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 8px;
  font-size: 12px;
  color: var(--text-2);
  line-height: 1.5;
  display: flex; gap: 10px; align-items: flex-start;
}
.garantia-box strong, .disclaimer-box strong {
  color: rgba(255,255,255,.65); font-weight: 600; display: block; margin-bottom: 3px;
}
.volume-strip {
  background: rgba(255,255,255,.02);
  border-top: 1px solid rgba(255,255,255,.06);
  padding: 24px 0;
}
.volume-inner {
  display: flex; align-items: center; justify-content: center;
  gap: 48px; flex-wrap: wrap; text-align: center;
}
.vol-item { display: flex; flex-direction: column; gap: 2px; }
.vol-num {
  font-family: var(--font-headline);
  font-size: 26px; font-weight: 800; color: var(--primary);
}
.vol-label { font-size: 12px; color: var(--text-2); }
@media (max-width: 640px) {
  .problems-grid { grid-template-columns: 1fr; }
  .form-footer { grid-template-columns: 1fr; }
  .volume-inner { gap: 24px; }
}
`

  const html = `
<nav class="topbar-nav">
  <div class="container topbar-nav-inner">
    <div class="logo-dot">{{NOME_PRODUTOR}}</div>
  </div>
</nav>
<section class="hero">
  <div class="hero-bg"></div>
  <div class="container hero-content">
    <div class="hero-badge">{{NICHO}}</div>
    <h1 class="hero-title">{{HEADLINE}}</h1>
    <p class="hero-sub">{{SUBHEADLINE}}</p>
    <div class="problems-grid">
      <div class="problem-card">
        <span class="problem-icon">⚡</span>
        <p class="problem-text">{{DOR_1}}</p>
      </div>
      <div class="problem-card">
        <span class="problem-icon">📊</span>
        <p class="problem-text">{{DOR_2}}</p>
      </div>
      <div class="problem-card">
        <span class="problem-icon">🎯</span>
        <p class="problem-text">{{DOR_3}}</p>
      </div>
      <div class="problem-card">
        <span class="problem-icon">🔄</span>
        <p class="problem-text">{{DOR_4}}</p>
      </div>
    </div>
    <div class="if-yes">Se você se identifica com isso, continue lendo ↓</div>
    <div class="form-section">
      <p class="form-title">{{TITULO_FORMULARIO}}</p>
      <p class="form-sub">{{SUBTITULO_FORMULARIO}}</p>
      <div class="form-card">
        <div class="form-field">
          <label class="form-label">Nome completo</label>
          <input class="form-input" type="text" placeholder="Seu nome">
        </div>
        <div class="form-field">
          <label class="form-label">E-mail corporativo</label>
          <input class="form-input" type="email" placeholder="seu@empresa.com">
        </div>
        <div class="form-field">
          <label class="form-label">Telefone / WhatsApp</label>
          <input class="form-input" type="tel" placeholder="+55 (11) 99999-9999">
        </div>
        <div class="form-field">
          <label class="form-label">{{LABEL_QUALIFICACAO_1}}</label>
          <select class="form-select">
            <option value="">Selecione...</option>
            <option>{{OPCAO_QUALIFICACAO_1}}</option>
            <option>{{OPCAO_QUALIFICACAO_2}}</option>
            <option>{{OPCAO_QUALIFICACAO_3}}</option>
          </select>
        </div>
        <button class="form-submit">{{TEXTO_CTA}}</button>
      </div>
      <div class="form-footer">
        <div class="garantia-box">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style="flex-shrink:0;margin-top:1px">
            <path d="M10 2L3 5V10C3 13.866 6.134 17.422 10 18C13.866 17.422 17 13.866 17 10V5L10 2Z" stroke="var(--primary)" stroke-width="1.5" fill="none"/>
            <path d="M7 10L9 12L13 8" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <div>
            <strong data-suggested="true">{{GARANTIA_CARTORIO}}</strong>
            100% confidencial. Sem compromisso.
          </div>
        </div>
        <div class="disclaimer-box">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style="flex-shrink:0;margin-top:1px">
            <circle cx="10" cy="10" r="7.5" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/>
            <path d="M10 9V14M10 7V7.01" stroke="rgba(255,255,255,.3)" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <div>
            <strong>Processo seletivo</strong>
            Aceitamos apenas clientes com fit para a metodologia.
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<div class="volume-strip">
  <div class="volume-inner">
    <div class="vol-item">
      <span class="vol-num" data-suggested="true">{{NUM_EMPRESAS}}</span>
      <span class="vol-label">empresas atendidas</span>
    </div>
    <div class="vol-item">
      <span class="vol-num" data-suggested="true">{{NUM_PAISES}}</span>
      <span class="vol-label">países</span>
    </div>
    <div class="vol-item">
      <span class="vol-num" data-suggested="true">{{NUM_NPS}}</span>
      <span class="vol-label">NPS</span>
    </div>
  </div>
</div>
`
  return { css, html }
}
