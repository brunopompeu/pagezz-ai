export function authorityStructure(): string {
  return /* html */`
{{HERO_CSS_SLOT}}
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: var(--font-body);
  font-size: 17px; line-height: 1.65;
  color: var(--text); background: var(--bg);
  -webkit-font-smoothing: antialiased;
}
.container { max-width: 860px; margin: 0 auto; padding: 0 24px; }

/* media-strip */
.media-strip { background: var(--bg-alt); padding: 36px 0; text-align: center; }
.media-label {
  font-size: 11px; font-weight: 700; letter-spacing: .1em;
  text-transform: uppercase; color: var(--text-2); margin-bottom: 20px;
}
.media-logos { display: flex; justify-content: center; align-items: center; gap: 40px; flex-wrap: wrap; }
.media-logo {
  font-family: var(--font-headline); font-size: 1.1rem; font-weight: 800;
  color: var(--text-2); opacity: .5; letter-spacing: -.02em;
  text-transform: uppercase;
}

/* sections */
.section { padding: 80px 0; }
.section.alt { background: var(--bg-alt); }
.section.dark { background: var(--bg-dark); }
.eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: .1em;
  text-transform: uppercase; color: var(--primary); margin-bottom: 14px;
}
.section-title {
  font-family: var(--font-headline);
  font-size: clamp(1.7rem, 4vw, 2.6rem);
  font-weight: 800; line-height: 1.15; margin-bottom: 20px;
}
.section-body { color: var(--text-2); max-width: 640px; }
.centered { text-align: center; }
.centered .section-body { margin: 0 auto; }

/* citacao produtor */
.produtor-quote {
  margin: 40px 0 0; padding: 32px 40px;
  border-left: 4px solid var(--primary); background: var(--bg-alt);
  border-radius: 0 8px 8px 0; font-style: italic;
  font-size: 1.1rem; line-height: 1.7; color: var(--text);
}
.produtor-quote footer {
  font-style: normal; font-size: .85rem; color: var(--primary);
  margin-top: 16px; font-weight: 600; border: none; padding: 0;
}

/* resultados-grid */
.resultados-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px;
}
.resultado-card {
  border: 1px solid rgba(255,255,255,.08); border-radius: 12px;
  padding: 28px; text-align: center;
}
.resultado-stat {
  font-family: var(--font-headline);
  font-size: 2.4rem; font-weight: 800; color: var(--primary); margin-bottom: 8px;
}
.resultado-label { font-size: .85rem; color: var(--text-2); }

/* problema */
.problema-list {
  list-style: none; display: flex; flex-direction: column; gap: 14px; margin-top: 28px;
}
.problema-list li {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 18px; border: 1px solid rgba(255,255,255,.06); border-radius: 8px;
}
.problema-list li::before {
  content: '→'; color: var(--primary); font-weight: 700; flex-shrink: 0; margin-top: 1px;
}

/* metodologia */
.metodo-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 36px;
}
.metodo-card {
  padding: 28px; border-radius: 12px;
  border: 1px solid rgba(255,255,255,.06); position: relative;
}
.metodo-num {
  position: absolute; top: 18px; right: 18px;
  font-family: var(--font-headline);
  font-size: 3rem; font-weight: 900;
  color: var(--primary); opacity: .12; line-height: 1;
}
.metodo-icon { font-size: 1.6rem; margin-bottom: 12px; }
.metodo-card h3 {
  font-family: var(--font-headline);
  font-size: 1rem; font-weight: 700; margin-bottom: 8px;
}
.metodo-card p { font-size: .875rem; color: var(--text-2); }

/* depoimentos */
.depoimentos-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px; margin-top: 36px;
}
.dep-card {
  border: 1px solid rgba(255,255,255,.08); border-radius: 12px; padding: 28px;
}
.dep-stars { color: var(--accent); font-size: 13px; margin-bottom: 12px; }
.dep-resultado {
  display: inline-block; background: rgba(201,168,76,.15); color: var(--primary);
  font-size: 11px; font-weight: 700; padding: 3px 10px;
  border-radius: 100px; margin-bottom: 12px;
}
.dep-card p { font-size: .875rem; color: var(--text-2); font-style: italic; margin-bottom: 16px; }
.dep-author { display: flex; align-items: center; gap: 10px; }
.dep-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,.06); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: var(--text-2);
}
.dep-name { font-size: 13px; font-weight: 600; }
.dep-desc { font-size: 11px; color: var(--text-2); }

/* bonus */
.bonus-box {
  background: linear-gradient(135deg, rgba(201,168,76,.08) 0%, rgba(201,168,76,.02) 100%);
  border: 1px solid rgba(201,168,76,.3); border-radius: 12px;
  padding: 36px 40px; margin-top: 36px; text-align: center;
}
.bonus-tag {
  display: inline-block; background: var(--primary); color: var(--text-inv);
  font-size: 10px; font-weight: 800; letter-spacing: .08em;
  text-transform: uppercase; padding: 4px 12px; border-radius: 100px; margin-bottom: 14px;
}
.bonus-box h3 {
  font-family: var(--font-headline); font-size: 1.4rem;
  font-weight: 700; margin-bottom: 10px;
}
.bonus-box p { font-size: .9rem; color: var(--text-2); }

/* garantia */
.garantia-box {
  display: flex; align-items: flex-start; gap: 28px;
  background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08);
  border-radius: 12px; padding: 36px; max-width: 700px; margin: 36px auto 0;
}
.garantia-icon { font-size: 3rem; flex-shrink: 0; }
.garantia-text h3 {
  font-family: var(--font-headline); font-size: 1.2rem;
  font-weight: 700; margin-bottom: 8px;
}
.garantia-text p { font-size: .9rem; color: var(--text-2); line-height: 1.7; }

/* faq */
.faq-list { display: flex; flex-direction: column; gap: 12px; margin-top: 36px; }
.faq-item { border: 1px solid rgba(255,255,255,.06); border-radius: 8px; overflow: hidden; }
.faq-q {
  width: 100%; text-align: left; background: transparent; border: none;
  padding: 20px 24px; font-size: .95rem; font-weight: 600; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center;
  color: var(--text); font-family: var(--font-body);
}
.faq-q::after { content: '+'; font-size: 1.2rem; color: var(--primary); }
.faq-a { padding: 0 24px 20px; font-size: .9rem; color: var(--text-2); line-height: 1.6; }

/* footer-cta — sem preço exposto */
.footer-cta { background: var(--bg-dark); padding: 100px 0; text-align: center; }
.footer-cta h2 {
  font-family: var(--font-headline);
  font-size: clamp(1.9rem, 5vw, 3rem);
  font-weight: 800; color: var(--text); margin-bottom: 14px;
}
.footer-cta p { color: var(--text-2); max-width: 560px; margin: 0 auto 40px; }
.btn-cta-lg {
  display: inline-block;
  background: var(--primary); color: var(--text-inv);
  font-weight: 700; font-size: 1.1rem;
  padding: 22px 64px; border-radius: 100px;
  text-decoration: none;
  transition: background .2s, transform .15s;
}
.btn-cta-lg:hover { background: var(--primary-dk); transform: translateY(-2px); }
.cta-sub { display: block; font-size: 12px; color: var(--text-2); margin-top: 16px; }

footer { padding: 28px 0; border-top: 1px solid rgba(255,255,255,.05); text-align: center; }
footer p { font-size: 12px; color: var(--text-2); }

@media (max-width: 640px) {
  .resultados-grid { grid-template-columns: 1fr 1fr; }
  .metodo-grid { grid-template-columns: 1fr; }
  .garantia-box { flex-direction: column; }
  .depoimentos-grid { grid-template-columns: 1fr; }
}
</style>

{{HERO_SLOT}}

<!-- AS VISTO EM (MÍDIA) -->
<div class="media-strip">
  <div class="container">
    <p class="media-label">Como visto em</p>
    <div class="media-logos">
      <span class="media-logo" data-suggested="true">{{MIDIA_1}}</span>
      <span class="media-logo" data-suggested="true">{{MIDIA_2}}</span>
      <span class="media-logo" data-suggested="true">{{MIDIA_3}}</span>
      <span class="media-logo" data-suggested="true">{{MIDIA_4}}</span>
    </div>
  </div>
</div>

<!-- CITAÇÃO / MANIFESTO DO PRODUTOR -->
<section class="section">
  <div class="container">
    <p class="eyebrow">A visão</p>
    <h2 class="section-title">Por que eu criei isso</h2>
    <blockquote class="produtor-quote">
      {{CITACAO_PRODUTOR}}
      <footer>— {{NOME_PRODUTOR}}</footer>
    </blockquote>
  </div>
</section>

<!-- RESULTADOS NUMÉRICOS -->
<section class="section alt">
  <div class="container centered">
    <p class="eyebrow">Impacto real</p>
    <h2 class="section-title">Números que validam o método</h2>
    <div class="resultados-grid">
      <div class="resultado-card">
        <div class="resultado-stat" data-suggested="true">{{NUM_ANOS}}</div>
        <div class="resultado-label">anos de experiência</div>
      </div>
      <div class="resultado-card">
        <div class="resultado-stat" data-suggested="true">{{NUM_CLIENTES}}</div>
        <div class="resultado-label">clientes transformados</div>
      </div>
      <div class="resultado-card">
        <div class="resultado-stat" data-suggested="true">{{NUM_RESULTADO}}</div>
        <div class="resultado-label">{{LABEL_RESULTADO}}</div>
      </div>
    </div>
  </div>
</section>

<!-- O PROBLEMA -->
<section class="section dark">
  <div class="container">
    <p class="eyebrow">O diagnóstico</p>
    <h2 class="section-title">{{TITULO_PROBLEMA}}</h2>
    <p class="section-body">{{TEXTO_AGITACAO}}</p>
    <ul class="problema-list">
      <li>{{DOR_1}}</li>
      <li>{{DOR_2}}</li>
      <li>{{DOR_3}}</li>
    </ul>
  </div>
</section>

<!-- METODOLOGIA -->
<section class="section">
  <div class="container">
    <p class="eyebrow">O método</p>
    <h2 class="section-title">{{TITULO_SOLUCAO}}</h2>
    <p class="section-body">{{TEXTO_SOLUCAO}}</p>
    <div class="metodo-grid">
      <div class="metodo-card">
        <span class="metodo-num">01</span>
        <div class="metodo-icon">{{ICONE_1}}</div>
        <h3>{{TITULO_SOL_1}}</h3>
        <p>{{DESC_SOL_1}}</p>
      </div>
      <div class="metodo-card">
        <span class="metodo-num">02</span>
        <div class="metodo-icon">{{ICONE_2}}</div>
        <h3>{{TITULO_SOL_2}}</h3>
        <p>{{DESC_SOL_2}}</p>
      </div>
      <div class="metodo-card">
        <span class="metodo-num">03</span>
        <div class="metodo-icon">{{ICONE_3}}</div>
        <h3>{{TITULO_SOL_3}}</h3>
        <p>{{DESC_SOL_3}}</p>
      </div>
      <div class="metodo-card">
        <span class="metodo-num">04</span>
        <div class="metodo-icon">{{ICONE_4}}</div>
        <h3>{{TITULO_SOL_4}}</h3>
        <p>{{DESC_SOL_4}}</p>
      </div>
    </div>
  </div>
</section>

<!-- DEPOIMENTOS -->
<section class="section alt" id="comprar">
  <div class="container centered">
    <p class="eyebrow">Prova social</p>
    <h2 class="section-title">O que dizem quem já passou pelo processo</h2>
    <div class="depoimentos-grid">
      <div class="dep-card">
        <div class="dep-stars">★★★★★</div>
        <span class="dep-resultado" data-suggested="true">{{RESULTADO_1}}</span>
        <p>"{{DEPOIMENTO_1}}"</p>
        <div class="dep-author">
          <div class="dep-avatar">😊</div>
          <div>
            <div class="dep-name" data-suggested="true">{{NOME_ALUNO_1}}</div>
            <div class="dep-desc" data-suggested="true">{{DESC_ALUNO_1}}</div>
          </div>
        </div>
      </div>
      <div class="dep-card">
        <div class="dep-stars">★★★★★</div>
        <span class="dep-resultado" data-suggested="true">{{RESULTADO_2}}</span>
        <p>"{{DEPOIMENTO_2}}"</p>
        <div class="dep-author">
          <div class="dep-avatar">😊</div>
          <div>
            <div class="dep-name" data-suggested="true">{{NOME_ALUNO_2}}</div>
            <div class="dep-desc" data-suggested="true">{{DESC_ALUNO_2}}</div>
          </div>
        </div>
      </div>
      <div class="dep-card">
        <div class="dep-stars">★★★★★</div>
        <span class="dep-resultado" data-suggested="true">{{RESULTADO_3}}</span>
        <p>"{{DEPOIMENTO_3}}"</p>
        <div class="dep-author">
          <div class="dep-avatar">😊</div>
          <div>
            <div class="dep-name" data-suggested="true">{{NOME_ALUNO_3}}</div>
            <div class="dep-desc" data-suggested="true">{{DESC_ALUNO_3}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- BÔNUS -->
<section class="section dark">
  <div class="container">
    <p class="eyebrow" style="text-align:center">Exclusivo</p>
    <h2 class="section-title" style="text-align:center">O que você recebe junto</h2>
    <div class="bonus-box">
      <span class="bonus-tag">BÔNUS</span>
      <h3>{{BONUS_TITULO}}</h3>
      <p>{{BONUS_DESC}}</p>
    </div>
  </div>
</section>

<!-- GARANTIA -->
<section class="section">
  <div class="container">
    <p class="eyebrow" style="text-align:center">Sem risco</p>
    <h2 class="section-title" style="text-align:center">{{TITULO_GARANTIA}}</h2>
    <div class="garantia-box">
      <span class="garantia-icon">🛡️</span>
      <div class="garantia-text">
        <h3>Garantia total de satisfação</h3>
        <p>{{TEXTO_GARANTIA}}</p>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section alt">
  <div class="container">
    <p class="eyebrow">Dúvidas</p>
    <h2 class="section-title">Perguntas frequentes</h2>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q">{{FAQ_P1}}</button>
        <div class="faq-a">{{FAQ_R1}}</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">{{FAQ_P2}}</button>
        <div class="faq-a">{{FAQ_R2}}</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">{{FAQ_P3}}</button>
        <div class="faq-a">{{FAQ_R3}}</div>
      </div>
    </div>
  </div>
</section>

<!-- CTA FINAL — sem preço exposto -->
<div class="footer-cta">
  <div class="container">
    <h2>{{HEADLINE_FINAL}}</h2>
    <p>{{URGENCIA}}</p>
    <a href="#" class="btn-cta-lg">{{TEXTO_CTA}}</a>
    <span class="cta-sub">Vagas limitadas · Aprovação por critérios</span>
  </div>
</div>

<footer>
  <div class="container">
    <p>© 2026 {{NOME_PRODUTOR}}. Todos os direitos reservados.</p>
  </div>
</footer>
`
}
