import type { StructureName } from '../types'

export function heroA(structure: StructureName): { css: string; html: string } {
  switch (structure) {
    case 'low-ticket': return lowTicketHeroA()
    case 'authority': return authorityHeroA()
    case 'qualification': return qualificationHeroA()
    default: return lowTicketHeroA()
  }
}

// ─── LOW TICKET — Hero A: Grid 50/50, preço exposto, foto placeholder ─────────

function lowTicketHeroA(): { css: string; html: string } {
  const css = `
.urgency-bar {
  background: var(--primary);
  color: #fff;
  text-align: center;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2px;
}
.urgency-bar strong { font-weight: 800; }
.hero {
  background: var(--bg-dark);
  padding: 72px 0 48px;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--primary);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 100px;
  margin-bottom: 24px;
}
.hero-title {
  font-family: var(--font-headline);
  font-size: clamp(32px, 4vw, 56px);
  font-weight: 800;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 20px;
}
.hero-sub {
  font-size: 17px;
  color: var(--text-2);
  line-height: 1.65;
  margin-bottom: 32px;
  max-width: 480px;
}
.price-block { margin-bottom: 32px; }
.price-de {
  font-size: 14px;
  color: var(--text-2);
  margin-bottom: 4px;
}
.price-de span { text-decoration: line-through; }
.price-main {
  font-family: var(--font-headline);
  font-size: 52px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  margin-bottom: 6px;
}
.price-parcela { font-size: 14px; color: var(--text-2); }
.btn-cta {
  display: inline-block;
  background: var(--primary);
  color: #fff;
  font-weight: 700;
  font-size: 17px;
  padding: 18px 40px;
  border-radius: 8px;
  text-decoration: none;
  transition: background .2s, transform .1s;
  box-shadow: 0 4px 24px rgba(232,65,10,.35);
}
.btn-cta:hover { background: var(--primary-dk); transform: translateY(-1px); }
.hero-right {
  display: flex;
  justify-content: center;
}
.foto-placeholder {
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 3/4;
  background: #1E1E1E;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 28px;
  border: 1px solid rgba(255,255,255,.07);
}
.foto-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 1;
}
.foto-silhueta {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 62%;
  height: 88%;
  background: linear-gradient(180deg, rgba(80,80,80,.25) 0%, rgba(50,50,50,.4) 100%);
  clip-path: polygon(25% 0%, 75% 0%, 92% 100%, 8% 100%);
}
.foto-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--accent);
  color: var(--bg-dark);
  font-family: var(--font-headline);
  font-weight: 800;
  font-size: 18px;
  padding: 8px 14px;
  border-radius: 8px;
  z-index: 3;
  line-height: 1.3;
  text-align: center;
}
.foto-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.foto-icon { font-size: 26px; opacity: .45; }
.foto-text { font-size: 12px; color: rgba(255,255,255,.3); }
.quick-proof {
  background: rgba(255,255,255,.03);
  border-top: 1px solid rgba(255,255,255,.06);
  padding: 28px 0;
}
.quick-proof-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  text-align: center;
}
.qp-item { display: flex; flex-direction: column; gap: 2px; }
.qp-num {
  font-family: var(--font-headline);
  font-size: 26px;
  font-weight: 800;
  color: var(--primary);
}
.qp-label { font-size: 12px; color: var(--text-2); }
@media (max-width: 768px) {
  .hero-grid { grid-template-columns: 1fr; gap: 32px; }
  .hero-right { display: none; }
  .price-main { font-size: 40px; }
  .quick-proof-grid { grid-template-columns: repeat(2, 1fr); }
}
`

  const html = `
<div class="urgency-bar">
  🔥 <strong>{{URGENCIA}}</strong>
</div>
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-left">
      <span class="hero-eyebrow">{{PRODUTO}}</span>
      <h1 class="hero-title">{{HEADLINE}}</h1>
      <p class="hero-sub">{{SUBHEADLINE}}</p>
      <div class="price-block">
        <div class="price-de">De <span>{{PRECO_DE}}</span></div>
        <div class="price-main">{{PRECO}}</div>
        <div class="price-parcela">ou {{PARCELAMENTO}}</div>
      </div>
      <a href="#comprar" class="btn-cta">{{TEXTO_CTA}}</a>
    </div>
    <div class="hero-right">
      <div class="foto-placeholder">
        {{HERO_IMAGE_HTML}}
        <div class="foto-silhueta"></div>
        <span class="foto-badge" data-suggested="true">{{NUM_RESULTADO}}<br><small style="font-size:11px;font-weight:600">{{LABEL_RESULTADO}}</small></span>
        <div class="foto-inner">
          <span class="foto-icon">📸</span>
          <p class="foto-text">Adicione sua foto</p>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="quick-proof">
  <div class="container quick-proof-grid">
    <div class="qp-item">
      <span class="qp-num" data-suggested="true">{{STAT_1_NUM}}</span>
      <span class="qp-label">{{STAT_1_LABEL}}</span>
    </div>
    <div class="qp-item">
      <span class="qp-num" data-suggested="true">{{STAT_2_NUM}}</span>
      <span class="qp-label">{{STAT_2_LABEL}}</span>
    </div>
    <div class="qp-item">
      <span class="qp-num">{{STAT_3_NUM}}</span>
      <span class="qp-label">{{STAT_3_LABEL}}</span>
    </div>
    <div class="qp-item">
      <span class="qp-num">{{STAT_4_NUM}}</span>
      <span class="qp-label">{{STAT_4_LABEL}}</span>
    </div>
  </div>
</section>
`
  return { css, html }
}

// ─── AUTHORITY — Hero A: Topbar, grid 50/50 Playfair, stats, foto com citação ─

function authorityHeroA(): { css: string; html: string } {
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
  letter-spacing: .5px;
}
.topbar-cta {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  letter-spacing: .3px;
}
.topbar-cta:hover { opacity: .75; }
.hero {
  background: var(--bg-dark);
  position: relative;
  padding: 120px 0 80px;
  min-height: 88vh;
  display: flex;
  align-items: center;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  width: 100%;
}
.hero-tag {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
}
.hero-tag::before {
  content: '';
  display: block;
  width: 40px; height: 2px;
  background: var(--primary);
  flex-shrink: 0;
}
.hero-tag span {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--primary);
}
.hero-title {
  font-family: var(--font-headline);
  font-size: clamp(32px, 3.5vw, 52px);
  font-weight: 800;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 20px;
}
.hero-title em { font-style: italic; color: var(--primary); }
.hero-divider {
  width: 48px; height: 3px;
  background: var(--primary);
  margin-bottom: 32px;
}
.hero-nums {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 40px;
}
.hero-num { display: flex; gap: 20px; align-items: flex-start; }
.num-val {
  font-family: var(--font-headline);
  font-size: 34px;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
  min-width: 72px;
}
.num-label {
  font-size: 14px;
  color: rgba(255,255,255,.6);
  line-height: 1.5;
  padding-top: 6px;
}
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
  letter-spacing: .3px;
}
.btn-cta:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(255,255,255,.03);
}
.foto-side {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  border-radius: 4px;
  overflow: hidden;
  background: #1A1A1A;
}
.foto-side::before {
  content: '';
  position: absolute; inset: 0;
  background-image: repeating-linear-gradient(45deg,
    rgba(255,255,255,.02) 0px, rgba(255,255,255,.02) 1px,
    transparent 1px, transparent 16px);
  z-index: 1;
}
.foto-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.65) 0%, transparent 55%);
  z-index: 2;
}
.foto-silhueta {
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 60%; height: 85%;
  background: linear-gradient(180deg, rgba(90,90,90,.2) 0%, rgba(55,55,55,.3) 100%);
  clip-path: polygon(25% 0%, 75% 0%, 92% 100%, 8% 100%);
  z-index: 1;
}
.foto-empty {
  position: absolute;
  bottom: 80px; left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 3;
}
.foto-empty .foto-icon { font-size: 24px; opacity: .4; display: block; }
.foto-empty .foto-text { font-size: 11px; color: rgba(255,255,255,.25); margin-top: 4px; }
.foto-quote {
  position: absolute;
  bottom: 24px; left: 20px; right: 20px;
  z-index: 4;
  padding: 14px 16px;
  border-left: 3px solid var(--primary);
  background: rgba(0,0,0,.65);
  backdrop-filter: blur(8px);
  border-radius: 0 4px 4px 0;
}
.foto-quote blockquote {
  font-size: 12px;
  color: rgba(255,255,255,.85);
  font-style: italic;
  line-height: 1.55;
  margin-bottom: 6px;
}
.foto-quote cite {
  font-size: 11px;
  color: var(--primary);
  font-style: normal;
  font-weight: 600;
}
.media-strip {
  background: rgba(255,255,255,.02);
  border-top: 1px solid rgba(255,255,255,.06);
  padding: 22px 0;
}
.media-strip-inner {
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
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
  .hero { padding: 100px 0 60px; min-height: auto; }
  .hero-grid { grid-template-columns: 1fr; gap: 40px; }
  .hero-right { display: none; }
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
    <div class="hero-left">
      <div class="hero-tag"><span>{{NICHO}}</span></div>
      <h1 class="hero-title">{{HEADLINE}}</h1>
      <div class="hero-divider"></div>
      <div class="hero-nums">
        <div class="hero-num">
          <span class="num-val" data-suggested="true">{{NUM_ANOS}}</span>
          <span class="num-label">anos de experiência no mercado</span>
        </div>
        <div class="hero-num">
          <span class="num-val" data-suggested="true">{{NUM_CLIENTES}}</span>
          <span class="num-label">clientes e empresas atendidas</span>
        </div>
        <div class="hero-num">
          <span class="num-val" data-suggested="true">{{NUM_RESULTADO}}</span>
          <span class="num-label">{{LABEL_RESULTADO}}</span>
        </div>
      </div>
      <a href="#contato" class="btn-cta">{{TEXTO_CTA}}</a>
    </div>
    <div class="hero-right">
      <div class="foto-side">
        {{HERO_IMAGE_HTML}}
        <div class="foto-silhueta"></div>
        <div class="foto-overlay"></div>
        <div class="foto-empty">
          <span class="foto-icon">📸</span>
          <p class="foto-text">Adicione sua foto</p>
        </div>
        <div class="foto-quote">
          <blockquote data-suggested="true">"{{CITACAO_PRODUTOR}}"</blockquote>
          <cite>— {{NOME_PRODUTOR}}</cite>
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

// ─── QUALIFICATION — Hero A: Topbar, split com formulário à direita ───────────

function qualificationHeroA(): { css: string; html: string } {
  const css = `
.topbar-nav {
  background: rgba(11,25,41,.95);
  border-bottom: 1px solid rgba(255,255,255,.06);
  padding: 16px 0;
  position: sticky;
  top: 0; z-index: 100;
}
.topbar-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo-dot {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
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
  padding: 72px 0 80px;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 64px;
  align-items: start;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(30,111,217,.4);
  color: var(--accent);
  background: rgba(30,111,217,.1);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 4px;
  margin-bottom: 24px;
}
.hero-title {
  font-family: var(--font-headline);
  font-size: clamp(28px, 3.5vw, 48px);
  font-weight: 800;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 20px;
}
.hero-sub {
  font-size: 16px;
  color: var(--text-2);
  line-height: 1.65;
  margin-bottom: 36px;
  max-width: 480px;
}
.pain-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
}
.pain-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  color: rgba(255,255,255,.8);
}
.pain-check {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px;
  flex-shrink: 0;
  margin-top: 1px;
}
.volume-nums {
  display: flex;
  gap: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(255,255,255,.08);
}
.vol-item { display: flex; flex-direction: column; gap: 2px; }
.vol-num {
  font-family: var(--font-headline);
  font-size: 28px;
  font-weight: 800;
  color: var(--primary);
}
.vol-label { font-size: 12px; color: var(--text-2); }
.form-card {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 12px;
  padding: 36px 32px;
  position: sticky;
  top: 80px;
}
.form-title {
  font-family: var(--font-headline);
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  line-height: 1.3;
}
.form-sub {
  font-size: 13px;
  color: var(--text-2);
  margin-bottom: 24px;
  line-height: 1.55;
}
.form-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.form-label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,.6); }
.form-input, .form-select {
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  color: #fff;
  border-radius: 6px;
  padding: 11px 14px;
  font-size: 14px;
  width: 100%;
  outline: none;
  font-family: inherit;
}
.form-input::placeholder { color: rgba(255,255,255,.3); }
.form-input:focus, .form-select:focus { border-color: var(--primary); }
.form-select option { background: #0F2035; }
.form-submit {
  width: 100%;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: background .2s, transform .1s;
  font-family: inherit;
}
.form-submit:hover { background: var(--primary-dk); transform: translateY(-1px); }
.garantia-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 12px;
  background: rgba(255,255,255,.03);
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,.06);
}
.garantia-strip svg { flex-shrink: 0; }
.garantia-strip p {
  font-size: 12px;
  color: var(--text-2);
  line-height: 1.4;
}
.garantia-strip strong { color: rgba(255,255,255,.7); font-weight: 600; }
@media (max-width: 768px) {
  .hero-grid { grid-template-columns: 1fr; }
  .form-card { position: static; }
  .volume-nums { gap: 20px; }
}
`

  const html = `
<nav class="topbar-nav">
  <div class="container topbar-nav-inner">
    <div class="logo-dot">{{NOME_PRODUTOR}}</div>
  </div>
</nav>
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-left">
      <span class="hero-badge">{{NICHO}}</span>
      <h1 class="hero-title">{{HEADLINE}}</h1>
      <p class="hero-sub">{{SUBHEADLINE}}</p>
      <ul class="pain-list">
        <li class="pain-item"><span class="pain-check">✓</span><span>{{DOR_1}}</span></li>
        <li class="pain-item"><span class="pain-check">✓</span><span>{{DOR_2}}</span></li>
        <li class="pain-item"><span class="pain-check">✓</span><span>{{DOR_3}}</span></li>
        <li class="pain-item"><span class="pain-check">✓</span><span>{{DOR_4}}</span></li>
      </ul>
      <div class="volume-nums">
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
    <div class="hero-right">
      <div class="form-card">
        <p class="form-title">{{TITULO_FORMULARIO}}</p>
        <p class="form-sub">{{SUBTITULO_FORMULARIO}}</p>
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
        <div class="garantia-strip">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 5V10C3 13.866 6.134 17.422 10 18C13.866 17.422 17 13.866 17 10V5L10 2Z" stroke="var(--primary)" stroke-width="1.5" fill="none"/>
            <path d="M7 10L9 12L13 8" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <p><strong>{{GARANTIA_CARTORIO}}</strong> · Nenhum compromisso até a conversa.</p>
        </div>
      </div>
    </div>
  </div>
</section>
`
  return { css, html }
}
