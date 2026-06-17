export function lowTicketStructure(): string {
  return /* html */`
{{HERO_CSS_SLOT}}
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.65;
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
}
.container { max-width: 780px; margin: 0 auto; padding: 0 24px; }

/* quick-proof */
.quick-proof {
  background: var(--bg-alt);
  padding: 48px 0;
  text-align: center;
}
.qp-label {
  font-size: 11px; font-weight: 700;
  letter-spacing: .1em; text-transform: uppercase;
  color: var(--primary); margin-bottom: 24px;
}
.proof-numbers {
  display: flex; justify-content: center;
  gap: 48px; flex-wrap: wrap;
}
.proof-num { text-align: center; }
.proof-num strong {
  display: block;
  font-family: var(--font-headline);
  font-size: 2.2rem; font-weight: 800;
  color: var(--text); line-height: 1;
}
.proof-num span { font-size: 13px; color: var(--text-2); }

/* sections */
.section { padding: 72px 0; }
.section.alt { background: var(--bg-alt); }
.eyebrow {
  font-size: 11px; font-weight: 700;
  letter-spacing: .1em; text-transform: uppercase;
  color: var(--primary); margin-bottom: 12px;
}
.section-title {
  font-family: var(--font-headline);
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 800; line-height: 1.15; margin-bottom: 24px;
}
.section-body { color: var(--text-2); }

/* testimonials */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px; margin-top: 32px;
}
.testimonial-card {
  background: var(--bg);
  border: 1px solid rgba(0,0,0,.08);
  border-radius: 12px; padding: 24px;
  position: relative;
}
.testimonial-card::before {
  content: '"';
  font-family: var(--font-headline);
  font-size: 4rem; color: var(--primary); opacity: .15;
  position: absolute; top: 8px; left: 16px; line-height: 1;
}
.stars { color: var(--accent); font-size: 14px; margin-bottom: 10px; }
.testimonial-result {
  display: inline-block;
  background: #EFFFEA; color: #1A7A35;
  font-size: 11px; font-weight: 700;
  padding: 3px 10px; border-radius: 100px; margin-bottom: 10px;
}
.testimonial-card p {
  font-size: .9rem; color: var(--text-2);
  font-style: italic; margin-bottom: 14px;
}
.testimonial-author { display: flex; align-items: center; gap: 10px; }
.testimonial-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: #E0E0E0; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: #999;
}
.testimonial-name { font-size: 13px; font-weight: 600; }
.testimonial-desc { font-size: 11px; color: var(--text-2); }

/* pain list */
.pain-list {
  list-style: none;
  display: flex; flex-direction: column; gap: 12px; margin-top: 24px;
}
.pain-list li {
  display: flex; align-items: flex-start; gap: 12px;
  font-size: 1rem; color: var(--text);
}
.pain-list li::before {
  content: '✗';
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; min-width: 24px;
  background: #FFE8E8; color: #D72B2B;
  border-radius: 50%; font-size: 11px; font-weight: 700; margin-top: 2px;
}

/* solution grid */
.solution-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 16px; margin-top: 32px;
}
.solution-card {
  background: var(--bg);
  border: 1.5px solid rgba(0,0,0,.08);
  border-radius: 12px; padding: 24px;
  transition: border-color .2s, box-shadow .2s;
}
.solution-card:hover { border-color: var(--primary); box-shadow: 0 4px 20px rgba(0,0,0,.08); }
.solution-icon { font-size: 1.8rem; margin-bottom: 12px; }
.solution-card h3 {
  font-family: var(--font-headline);
  font-size: 1rem; font-weight: 700; margin-bottom: 8px;
}
.solution-card p { font-size: .9rem; color: var(--text-2); }

/* deliverables */
.deliverables-list {
  list-style: none;
  display: flex; flex-direction: column; gap: 14px; margin-top: 24px;
}
.deliverables-list li {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 16px; background: var(--bg);
  border-radius: 6px; border-left: 3px solid var(--primary);
}
.del-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 2px; }
.deliverables-list li strong { display: block; font-size: .95rem; margin-bottom: 3px; }
.deliverables-list li span { font-size: .875rem; color: var(--text-2); }

/* for-who */
.for-who-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 24px; margin-top: 32px;
}
.for-who-block h3 {
  font-family: var(--font-headline);
  font-size: 1rem; font-weight: 700; margin-bottom: 14px;
}
.for-who-list {
  list-style: none;
  display: flex; flex-direction: column; gap: 10px;
}
.for-who-list li { display: flex; align-items: flex-start; gap: 10px; font-size: .9rem; }
.check-yes { color: #1A7A35; font-weight: 700; flex-shrink: 0; }
.check-no  { color: #D72B2B; font-weight: 700; flex-shrink: 0; }

/* guarantee */
.guarantee-box {
  display: flex; align-items: flex-start; gap: 24px;
  background: #FAFFF7; border: 2px solid #C8EFC8;
  border-radius: 12px; padding: 32px;
  max-width: 640px; margin: 32px auto 0;
}
.guarantee-icon { font-size: 3.5rem; flex-shrink: 0; }
.guarantee-text h3 {
  font-family: var(--font-headline);
  font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;
}
.guarantee-text p { font-size: .9rem; color: var(--text-2); line-height: 1.6; }

/* faq */
.faq-list { display: flex; flex-direction: column; gap: 12px; margin-top: 32px; }
.faq-item { border: 1px solid rgba(0,0,0,.08); border-radius: 6px; overflow: hidden; }
.faq-q {
  width: 100%; text-align: left; background: var(--bg); border: none;
  padding: 18px 20px; font-size: .95rem; font-weight: 600; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center;
  color: var(--text); font-family: var(--font-body);
}
.faq-q::after { content: '+'; font-size: 1.2rem; color: var(--primary); }
.faq-a { padding: 0 20px 18px; font-size: .9rem; color: var(--text-2); line-height: 1.6; }

/* footer-cta */
.footer-cta { background: var(--bg-dark); padding: 80px 0; text-align: center; }
.footer-cta h2 {
  font-family: var(--font-headline);
  font-size: clamp(1.8rem, 4.5vw, 2.8rem);
  font-weight: 800; color: #fff; margin-bottom: 12px;
}
.footer-cta p { color: #888; margin-bottom: 36px; }
.price-block-cta {
  display: flex; flex-direction: column; align-items: center; gap: 4px; margin-bottom: 24px;
}
.price-from { font-size: 13px; color: #777; }
.price-from s { color: #555; }
.price-big {
  font-family: var(--font-headline);
  font-size: 3rem; font-weight: 800; color: #fff; line-height: 1;
}
.price-parcel { font-size: 13px; color: #888; }
.btn-cta-lg {
  display: inline-block;
  background: var(--primary); color: #fff;
  font-weight: 700; font-size: 1.1rem;
  padding: 20px 56px; border-radius: 100px;
  text-decoration: none;
  transition: background .2s, transform .15s;
}
.btn-cta-lg:hover { background: var(--primary-dk); transform: translateY(-2px); }
.cta-sub { display: block; font-size: 12px; color: #777; margin-top: 12px; }

footer { padding: 28px 0; border-top: 1px solid rgba(255,255,255,.06); text-align: center; }
footer p { font-size: 12px; color: #777; }

@media (max-width: 640px) {
  .solution-grid { grid-template-columns: 1fr; }
  .for-who-grid { grid-template-columns: 1fr; }
  .proof-numbers { gap: 28px; }
  .guarantee-box { flex-direction: column; }
  .testimonials-grid { grid-template-columns: 1fr; }
}
</style>

{{HERO_SLOT}}

<!-- PROVA SOCIAL RÁPIDA -->
<div class="quick-proof">
  <div class="container">
    <p class="qp-label">Resultados que falam por si</p>
    <div class="proof-numbers">
      <div class="proof-num">
        <strong data-suggested="true">{{NUM_ALUNOS}}</strong>
        <span>alunos transformados</span>
      </div>
      <div class="proof-num">
        <strong data-suggested="true">{{NUM_AVALIACAO}}</strong>
        <span>avaliação média</span>
      </div>
      <div class="proof-num">
        <strong data-suggested="true">{{NUM_RESULTADO}}</strong>
        <span>{{LABEL_RESULTADO}}</span>
      </div>
    </div>
  </div>
</div>

<!-- DEPOIMENTOS -->
<section class="section alt">
  <div class="container">
    <p class="eyebrow">Quem já passou pelo {{NOME_PRODUTO}}</p>
    <h2 class="section-title">Resultados reais de pessoas reais</h2>
    <div class="testimonials-grid">
      <div class="testimonial-card">
        <div class="stars">★★★★★</div>
        <span class="testimonial-result" data-suggested="true">{{RESULTADO_1}}</span>
        <p>"{{DEPOIMENTO_1}}"</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">😊</div>
          <div>
            <div class="testimonial-name" data-suggested="true">{{NOME_ALUNO_1}}</div>
            <div class="testimonial-desc" data-suggested="true">{{DESC_ALUNO_1}}</div>
          </div>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="stars">★★★★★</div>
        <span class="testimonial-result" data-suggested="true">{{RESULTADO_2}}</span>
        <p>"{{DEPOIMENTO_2}}"</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">😊</div>
          <div>
            <div class="testimonial-name" data-suggested="true">{{NOME_ALUNO_2}}</div>
            <div class="testimonial-desc" data-suggested="true">{{DESC_ALUNO_2}}</div>
          </div>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="stars">★★★★★</div>
        <span class="testimonial-result" data-suggested="true">{{RESULTADO_3}}</span>
        <p>"{{DEPOIMENTO_3}}"</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">😊</div>
          <div>
            <div class="testimonial-name" data-suggested="true">{{NOME_ALUNO_3}}</div>
            <div class="testimonial-desc" data-suggested="true">{{DESC_ALUNO_3}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PROBLEMA -->
<section class="section">
  <div class="container">
    <p class="eyebrow">O Problema</p>
    <h2 class="section-title">{{TITULO_PROBLEMA}}</h2>
    <p class="section-body">{{TEXTO_AGITACAO}}</p>
    <ul class="pain-list">
      <li>{{DOR_1}}</li>
      <li>{{DOR_2}}</li>
      <li>{{DOR_3}}</li>
    </ul>
  </div>
</section>

<!-- SOLUÇÃO -->
<section class="section alt">
  <div class="container">
    <p class="eyebrow">A Solução</p>
    <h2 class="section-title">{{TITULO_SOLUCAO}}</h2>
    <p class="section-body">{{TEXTO_SOLUCAO}}</p>
    <div class="solution-grid">
      <div class="solution-card">
        <div class="solution-icon">{{ICONE_1}}</div>
        <h3>{{TITULO_SOL_1}}</h3>
        <p>{{DESC_SOL_1}}</p>
      </div>
      <div class="solution-card">
        <div class="solution-icon">{{ICONE_2}}</div>
        <h3>{{TITULO_SOL_2}}</h3>
        <p>{{DESC_SOL_2}}</p>
      </div>
      <div class="solution-card">
        <div class="solution-icon">{{ICONE_3}}</div>
        <h3>{{TITULO_SOL_3}}</h3>
        <p>{{DESC_SOL_3}}</p>
      </div>
      <div class="solution-card">
        <div class="solution-icon">{{ICONE_4}}</div>
        <h3>{{TITULO_SOL_4}}</h3>
        <p>{{DESC_SOL_4}}</p>
      </div>
    </div>
  </div>
</section>

<!-- ENTREGÁVEIS -->
<section class="section" id="comprar">
  <div class="container">
    <p class="eyebrow">O que você recebe</p>
    <h2 class="section-title">Tudo incluso no {{NOME_PRODUTO}}</h2>
    <ul class="deliverables-list">
      <li>
        <span class="del-icon">{{ICONE_ENT_1}}</span>
        <div><strong>{{TITULO_ENT_1}}</strong><span>{{DESC_ENT_1}}</span></div>
      </li>
      <li>
        <span class="del-icon">{{ICONE_ENT_2}}</span>
        <div><strong>{{TITULO_ENT_2}}</strong><span>{{DESC_ENT_2}}</span></div>
      </li>
      <li>
        <span class="del-icon">{{ICONE_ENT_3}}</span>
        <div><strong>{{TITULO_ENT_3}}</strong><span>{{DESC_ENT_3}}</span></div>
      </li>
      <li>
        <span class="del-icon">{{ICONE_ENT_4}}</span>
        <div><strong>{{TITULO_ENT_4}}</strong><span>{{DESC_ENT_4}}</span></div>
      </li>
    </ul>
  </div>
</section>

<!-- PARA QUEM É -->
<section class="section alt">
  <div class="container">
    <p class="eyebrow">Para quem é</p>
    <h2 class="section-title">{{NOME_PRODUTO}} é para você?</h2>
    <div class="for-who-grid">
      <div class="for-who-block">
        <h3>✅ É para você se...</h3>
        <ul class="for-who-list">
          <li><span class="check-yes">✓</span> {{PARA_QUEM_1}}</li>
          <li><span class="check-yes">✓</span> {{PARA_QUEM_2}}</li>
          <li><span class="check-yes">✓</span> {{PARA_QUEM_3}}</li>
        </ul>
      </div>
      <div class="for-who-block">
        <h3>❌ Não é para você se...</h3>
        <ul class="for-who-list">
          <li><span class="check-no">✗</span> {{NAO_PARA_1}}</li>
          <li><span class="check-no">✗</span> {{NAO_PARA_2}}</li>
          <li><span class="check-no">✗</span> {{NAO_PARA_3}}</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- GARANTIA -->
<section class="section">
  <div class="container">
    <p class="eyebrow" style="text-align:center">Risco zero</p>
    <h2 class="section-title" style="text-align:center">{{TITULO_GARANTIA}}</h2>
    <div class="guarantee-box">
      <span class="guarantee-icon">🛡️</span>
      <div class="guarantee-text">
        <h3>Sua satisfação ou seu dinheiro de volta</h3>
        <p>{{TEXTO_GARANTIA}}</p>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section alt">
  <div class="container">
    <p class="eyebrow">Dúvidas frequentes</p>
    <h2 class="section-title">Perguntas que você pode ter</h2>
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
    <div class="price-block-cta">
      <span class="price-from">De <s>{{PRECO_DE}}</s> por apenas</span>
      <span class="price-big">{{PRECO}}</span>
      <span class="price-parcel">ou {{PARCELAMENTO}}</span>
    </div>
    <a href="#" class="btn-cta-lg">{{TEXTO_CTA}}</a>
    <span class="cta-sub">🔒 Acesso imediato · Pagamento 100% seguro</span>
  </div>
</div>

<footer>
  <div class="container">
    <p>© 2026 {{NOME_PRODUTO}}. Todos os direitos reservados.</p>
  </div>
</footer>
`
}
