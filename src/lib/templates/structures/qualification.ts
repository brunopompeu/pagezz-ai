export function qualificationStructure(): string {
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
.container { max-width: 920px; margin: 0 auto; padding: 0 24px; }

/* trust-strip */
.trust-strip { background: var(--bg-alt); padding: 40px 0; text-align: center; }
.trust-label {
  font-size: 11px; font-weight: 700; letter-spacing: .1em;
  text-transform: uppercase; color: var(--text-2); margin-bottom: 20px;
}
.trust-logos { display: flex; justify-content: center; align-items: center; gap: 48px; flex-wrap: wrap; }
.trust-logo {
  font-family: var(--font-headline); font-size: .95rem; font-weight: 800;
  color: var(--text-2); opacity: .4; letter-spacing: -.01em; text-transform: uppercase;
}
.trust-dividers { display: flex; align-items: center; gap: 24px; justify-content: center; margin-top: 24px; }
.trust-stat { text-align: center; }
.trust-stat strong {
  display: block; font-family: var(--font-headline);
  font-size: 1.6rem; font-weight: 700; color: var(--primary);
}
.trust-stat span { font-size: 12px; color: var(--text-2); }
.trust-sep { width: 1px; height: 40px; background: rgba(255,255,255,.08); }

/* sections */
.section { padding: 80px 0; }
.section.alt { background: var(--bg-alt); }
.section.dark { background: var(--bg-dark); }
.section.center { text-align: center; }
.eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: .1em;
  text-transform: uppercase; color: var(--primary); margin-bottom: 14px;
}
.section-title {
  font-family: var(--font-headline);
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 800; line-height: 1.15; margin-bottom: 20px;
}
.section-body { color: var(--text-2); }
.section-body.wide { max-width: 680px; }

/* diagnóstico problemas */
.diagnostico-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 16px; margin-top: 32px;
}
.diag-card {
  background: rgba(255,255,255,.02); border: 1px solid rgba(255,255,255,.06);
  border-radius: 10px; padding: 24px;
}
.diag-icon { font-size: 1.6rem; margin-bottom: 10px; }
.diag-card h3 { font-size: .95rem; font-weight: 700; margin-bottom: 6px; }
.diag-card p { font-size: .85rem; color: var(--text-2); }

/* resultados empresariais */
.resultados-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px; margin-top: 36px;
}
.result-card {
  border: 1px solid rgba(255,255,255,.06); border-radius: 12px;
  padding: 28px 20px; text-align: center;
}
.result-num {
  font-family: var(--font-headline); font-size: 2rem;
  font-weight: 800; color: var(--primary); line-height: 1; margin-bottom: 8px;
}
.result-label { font-size: .8rem; color: var(--text-2); }

/* metodologia / pilares */
.pilares-list {
  display: flex; flex-direction: column; gap: 20px; margin-top: 36px;
}
.pilar {
  display: flex; gap: 24px; align-items: flex-start;
  padding: 28px; border: 1px solid rgba(255,255,255,.06); border-radius: 12px;
}
.pilar-num {
  font-family: var(--font-headline); font-size: 2rem; font-weight: 900;
  color: var(--primary); opacity: .4; line-height: 1;
  flex-shrink: 0; width: 48px;
}
.pilar-body h3 { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
.pilar-body p { font-size: .875rem; color: var(--text-2); }

/* cases / depoimentos */
.cases-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 36px;
}
.case-card {
  background: rgba(255,255,255,.02); border: 1px solid rgba(255,255,255,.06);
  border-radius: 12px; padding: 32px;
}
.case-company {
  font-size: 11px; font-weight: 700; letter-spacing: .08em;
  text-transform: uppercase; color: var(--primary); margin-bottom: 16px;
}
.case-result {
  font-family: var(--font-headline); font-size: 1.6rem;
  font-weight: 800; margin-bottom: 12px;
}
.case-card p { font-size: .875rem; color: var(--text-2); line-height: 1.7; margin-bottom: 20px; }
.case-author { display: flex; align-items: center; gap: 12px; }
.case-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,.06); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
}
.case-name { font-size: 13px; font-weight: 600; }
.case-role { font-size: 11px; color: var(--text-2); }

/* processo / etapas */
.etapas { display: flex; flex-direction: column; gap: 0; margin-top: 40px; position: relative; }
.etapas::before {
  content: ''; position: absolute; left: 23px; top: 48px; bottom: 0; width: 2px;
  background: linear-gradient(to bottom, var(--primary), transparent);
}
.etapa { display: flex; gap: 24px; margin-bottom: 32px; position: relative; }
.etapa-circle {
  width: 48px; height: 48px; border-radius: 50%;
  border: 2px solid var(--primary); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-headline); font-weight: 800;
  font-size: 1rem; color: var(--primary); background: var(--bg-dark);
  position: relative; z-index: 1;
}
.etapa-body { padding-top: 10px; }
.etapa-body h3 { font-size: .95rem; font-weight: 700; margin-bottom: 6px; }
.etapa-body p { font-size: .875rem; color: var(--text-2); }

/* garantia cartório */
.garantia-box {
  background: rgba(255,255,255,.02); border: 1px solid rgba(255,255,255,.06);
  border-radius: 12px; padding: 40px; text-align: center; margin-top: 36px;
}
.garantia-icons { font-size: 2.5rem; margin-bottom: 16px; }
.garantia-box h3 {
  font-family: var(--font-headline); font-size: 1.3rem;
  font-weight: 700; margin-bottom: 10px;
}
.garantia-box p { font-size: .9rem; color: var(--text-2); max-width: 520px; margin: 0 auto; }
.garantia-cartorio {
  display: inline-block; background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.1); border-radius: 8px;
  padding: 10px 20px; margin-top: 20px;
  font-size: .8rem; color: var(--text-2);
}
.garantia-cartorio strong { color: var(--text); }

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

/* footer cta */
.footer-cta { background: var(--bg-dark); padding: 100px 0; text-align: center; }
.footer-cta h2 {
  font-family: var(--font-headline);
  font-size: clamp(1.7rem, 4vw, 2.8rem);
  font-weight: 800; color: var(--text); margin-bottom: 14px;
}
.footer-cta p { color: var(--text-2); max-width: 560px; margin: 0 auto 40px; }
.btn-cta-lg {
  display: inline-block; background: var(--primary); color: var(--text-inv);
  font-weight: 700; font-size: 1.05rem;
  padding: 20px 60px; border-radius: 100px; text-decoration: none;
  transition: background .2s, transform .15s;
}
.btn-cta-lg:hover { background: var(--primary-dk); transform: translateY(-2px); }
.cta-sub { display: block; font-size: 12px; color: var(--text-2); margin-top: 16px; }

footer { padding: 28px 0; border-top: 1px solid rgba(255,255,255,.05); text-align: center; }
footer p { font-size: 12px; color: var(--text-2); }
footer a { color: var(--text-2); text-decoration: none; }

@media (max-width: 640px) {
  .diagnostico-grid { grid-template-columns: 1fr; }
  .resultados-grid { grid-template-columns: 1fr 1fr; }
  .cases-grid { grid-template-columns: 1fr; }
  .trust-logos { gap: 24px; }
}
</style>

{{HERO_SLOT}}

<!-- CONFIANÇA — EMPRESAS E NPS -->
<div class="trust-strip">
  <div class="container">
    <p class="trust-label">Empresas que confiam no processo</p>
    <div class="trust-logos">
      <span class="trust-logo" data-suggested="true">{{EMPRESA_1}}</span>
      <span class="trust-logo" data-suggested="true">{{EMPRESA_2}}</span>
      <span class="trust-logo" data-suggested="true">{{EMPRESA_3}}</span>
      <span class="trust-logo" data-suggested="true">{{EMPRESA_4}}</span>
    </div>
    <div class="trust-dividers">
      <div class="trust-stat">
        <strong data-suggested="true">{{NUM_EMPRESAS}}</strong>
        <span>empresas atendidas</span>
      </div>
      <div class="trust-sep"></div>
      <div class="trust-stat">
        <strong data-suggested="true">{{NUM_PAISES}}</strong>
        <span>países de atuação</span>
      </div>
      <div class="trust-sep"></div>
      <div class="trust-stat">
        <strong data-suggested="true">{{NUM_NPS}}</strong>
        <span>NPS médio</span>
      </div>
    </div>
  </div>
</div>

<!-- DIAGNÓSTICO / PROBLEMA -->
<section class="section">
  <div class="container">
    <p class="eyebrow">O problema</p>
    <h2 class="section-title">{{TITULO_PROBLEMA}}</h2>
    <p class="section-body wide">{{TEXTO_AGITACAO}}</p>
    <div class="diagnostico-grid">
      <div class="diag-card">
        <div class="diag-icon">{{ICONE_DOR_1}}</div>
        <h3>{{DOR_1}}</h3>
        <p>{{DESC_DOR_1}}</p>
      </div>
      <div class="diag-card">
        <div class="diag-icon">{{ICONE_DOR_2}}</div>
        <h3>{{DOR_2}}</h3>
        <p>{{DESC_DOR_2}}</p>
      </div>
      <div class="diag-card">
        <div class="diag-icon">{{ICONE_DOR_3}}</div>
        <h3>{{DOR_3}}</h3>
        <p>{{DESC_DOR_3}}</p>
      </div>
      <div class="diag-card">
        <div class="diag-icon">{{ICONE_DOR_4}}</div>
        <h3>{{DOR_4}}</h3>
        <p>{{DESC_DOR_4}}</p>
      </div>
    </div>
  </div>
</section>

<!-- RESULTADOS EMPRESARIAIS -->
<section class="section alt center">
  <div class="container">
    <p class="eyebrow">Impacto comprovado</p>
    <h2 class="section-title">Resultados que transformam organizações</h2>
    <div class="resultados-grid">
      <div class="result-card">
        <div class="result-num" data-suggested="true">{{NUM_ANOS}}</div>
        <div class="result-label">anos de experiência</div>
      </div>
      <div class="result-card">
        <div class="result-num" data-suggested="true">{{NUM_CLIENTES}}</div>
        <div class="result-label">clientes atendidos</div>
      </div>
      <div class="result-card">
        <div class="result-num" data-suggested="true">{{NUM_RESULTADO}}</div>
        <div class="result-label">{{LABEL_RESULTADO}}</div>
      </div>
      <div class="result-card">
        <div class="result-num" data-suggested="true">{{NUM_EXTRA}}</div>
        <div class="result-label">{{LABEL_EXTRA}}</div>
      </div>
    </div>
  </div>
</section>

<!-- METODOLOGIA / PILARES -->
<section class="section dark">
  <div class="container">
    <p class="eyebrow">A metodologia</p>
    <h2 class="section-title">{{TITULO_SOLUCAO}}</h2>
    <p class="section-body">{{TEXTO_SOLUCAO}}</p>
    <div class="pilares-list">
      <div class="pilar">
        <span class="pilar-num">01</span>
        <div class="pilar-body"><h3>{{TITULO_SOL_1}}</h3><p>{{DESC_SOL_1}}</p></div>
      </div>
      <div class="pilar">
        <span class="pilar-num">02</span>
        <div class="pilar-body"><h3>{{TITULO_SOL_2}}</h3><p>{{DESC_SOL_2}}</p></div>
      </div>
      <div class="pilar">
        <span class="pilar-num">03</span>
        <div class="pilar-body"><h3>{{TITULO_SOL_3}}</h3><p>{{DESC_SOL_3}}</p></div>
      </div>
      <div class="pilar">
        <span class="pilar-num">04</span>
        <div class="pilar-body"><h3>{{TITULO_SOL_4}}</h3><p>{{DESC_SOL_4}}</p></div>
      </div>
    </div>
  </div>
</section>

<!-- CASES / DEPOIMENTOS -->
<section class="section" id="contato">
  <div class="container">
    <p class="eyebrow">Cases reais</p>
    <h2 class="section-title">Transformações documentadas</h2>
    <div class="cases-grid">
      <div class="case-card">
        <div class="case-company" data-suggested="true">{{EMPRESA_CASE_1}}</div>
        <div class="case-result">{{RESULTADO_1}}</div>
        <p>"{{DEPOIMENTO_1}}"</p>
        <div class="case-author">
          <div class="case-avatar">🏢</div>
          <div>
            <div class="case-name" data-suggested="true">{{NOME_ALUNO_1}}</div>
            <div class="case-role" data-suggested="true">{{DESC_ALUNO_1}}</div>
          </div>
        </div>
      </div>
      <div class="case-card">
        <div class="case-company" data-suggested="true">{{EMPRESA_CASE_2}}</div>
        <div class="case-result">{{RESULTADO_2}}</div>
        <p>"{{DEPOIMENTO_2}}"</p>
        <div class="case-author">
          <div class="case-avatar">🏢</div>
          <div>
            <div class="case-name" data-suggested="true">{{NOME_ALUNO_2}}</div>
            <div class="case-role" data-suggested="true">{{DESC_ALUNO_2}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PROCESSO DE QUALIFICAÇÃO -->
<section class="section alt">
  <div class="container">
    <p class="eyebrow">Como funciona</p>
    <h2 class="section-title">O processo de qualificação</h2>
    <p class="section-body wide">Nosso processo é criterioso para garantir que possamos gerar o máximo de resultado para cada cliente.</p>
    <div class="etapas">
      <div class="etapa">
        <div class="etapa-circle">1</div>
        <div class="etapa-body">
          <h3>Candidatura</h3>
          <p>Preencha o formulário de qualificação acima com informações sobre seu negócio e desafios atuais.</p>
        </div>
      </div>
      <div class="etapa">
        <div class="etapa-circle">2</div>
        <div class="etapa-body">
          <h3>Análise</h3>
          <p>Nossa equipe analisa sua candidatura em até 48 horas e avalia o fit com nossa metodologia.</p>
        </div>
      </div>
      <div class="etapa">
        <div class="etapa-circle">3</div>
        <div class="etapa-body">
          <h3>Diagnóstico</h3>
          <p>Se aprovado, realizamos uma sessão de diagnóstico para entender seus desafios com profundidade.</p>
        </div>
      </div>
      <div class="etapa">
        <div class="etapa-circle">4</div>
        <div class="etapa-body">
          <h3>Proposta personalizada</h3>
          <p>Apresentamos uma proposta sob medida com escopo, investimento e projeção de resultados.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- GARANTIA CARTÓRIO -->
<section class="section dark center">
  <div class="container">
    <p class="eyebrow">Comprometimento</p>
    <h2 class="section-title">Nossa promessa</h2>
    <div class="garantia-box">
      <div class="garantia-icons">🤝🛡️</div>
      <h3>Contrato com metas claras e mensuráveis</h3>
      <p>{{TEXTO_GARANTIA}}</p>
      <span class="garantia-cartorio">
        <strong data-suggested="true">{{GARANTIA_CARTORIO}}</strong>
      </span>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section">
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

<!-- CTA FINAL -->
<div class="footer-cta">
  <div class="container">
    <h2>{{HEADLINE_FINAL}}</h2>
    <p>{{URGENCIA}}</p>
    <a href="#contato" class="btn-cta-lg">{{TEXTO_CTA}}</a>
    <span class="cta-sub">Análise em até 48h · Sem compromisso</span>
  </div>
</div>

<footer>
  <div class="container">
    <p>© 2026 {{NOME_PRODUTOR}}. Todos os direitos reservados. ·
      <a href="#">Política de Privacidade</a> ·
      <a href="#">Termos de Uso</a>
    </p>
  </div>
</footer>
`
}
