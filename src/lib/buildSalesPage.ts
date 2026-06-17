import type { OnboardingData } from '@/types'
import { getTicketStrategy } from './agents/ticketStrategy'

export interface SalesPageData {
  onboarding: OnboardingData
  copy: string
  design: string
}

// Extracts a value from the agent output using a heading keyword
function extract(text: string, ...keywords: string[]): string {
  for (const kw of keywords) {
    const re = new RegExp(
      String.raw`##[^#\n]*` + kw + String.raw`[^\n]*\n([\s\S]*?)(?=\n##|$)`,
      'i',
    )
    const m = text.match(re)
    if (m) return m[1].trim()
  }
  return ''
}

// Extracts content under a **bold** subsection header (e.g. inside ## Seções da Página)
function extractBold(text: string, ...keywords: string[]): string {
  for (const kw of keywords) {
    const re = new RegExp(
      String.raw`\*\*[^*\n]*` + kw + String.raw`[^*\n]*\*\*[^\n]*\n([\s\S]*?)(?=\n\*\*|\n##|$)`,
      'i',
    )
    const m = text.match(re)
    if (m) return m[1].trim()
  }
  return ''
}

function firstBullet(block: string): string {
  const lines = block.split('\n').map((l) => l.replace(/^[-*•]\s*/, '').trim()).filter(Boolean)
  return lines[0] ?? ''
}

function allBullets(block: string): string[] {
  return block.split('\n').map((l) => l.replace(/^[-*•]\s*/, '').trim()).filter(Boolean)
}

function extractHex(text: string): string | null {
  const m = text.match(/#([0-9A-Fa-f]{6})\b/)
  return m ? `#${m[1]}` : null
}

function hexLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const lin = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrastColor(bg: string): string {
  return hexLuminance(bg) > 0.3 ? '#111111' : '#FFFFFF'
}

function extractFontName(block: string): string {
  const m = block.match(/\*\*([^*]+)\*\*/) ?? block.match(/Fonte[^:]*:\s*([^\n(,]+)/)
  if (m) return m[1].replace(/\(.*\)/, '').trim()
  const lines = block.split('\n').filter(Boolean)
  return lines[0]?.replace(/^[-*•]\s*/, '').split(/[:(]/)[0].trim() ?? 'Inter'
}

interface ParsedDesign {
  primaryColor: string
  secondaryColor: string
  bgColor: string
  bgAlt: string
  textColor: string
  textSecondary: string
  headlineFont: string
  bodyFont: string
}

function parseDesign(design: string): ParsedDesign {
  const paletteBlock = extract(design, 'Paleta', 'Cores')
  const typoBlock = extract(design, 'Tipografia', 'Fonte')

  const lines = paletteBlock.split('\n')

  function findHex(keywords: string[]): string {
    for (const kw of keywords) {
      for (const ln of lines) {
        if (ln.toLowerCase().includes(kw.toLowerCase())) {
          const hex = extractHex(ln)
          if (hex) return hex
        }
      }
    }
    return ''
  }

  const primaryColor = findHex(['primária', 'cta', 'destaque', 'primary']) || '#7C3AED'
  const secondaryColor = findHex(['secundária', 'apoio', 'secondary']) || '#A78BFA'
  const bgColor = findHex(['fundo principal', 'background', 'bg principal']) || '#0F0F13'
  const bgAlt = findHex(['background alt', 'bg alt', 'alternado', 'seções alternadas', 'fundo alt']) || '#1A1A22'
  const textColor = findHex(['text: ', 'texto: ', 'texto principal', 'text primary']) || '#F1F5F9'
  const textSecondary = findHex(['texto secundário', 'text secondary', 'muted', 'secundário']) || '#94A3B8'

  const typoLines = typoBlock.split('\n')
  const headlineFont = extractFontName(typoLines.find((l) => /headline|título|h1/i.test(l)) ?? typoLines[0] ?? '') || 'Sora'
  const bodyFont = extractFontName(typoLines.find((l) => /corpo|body|texto/i.test(l)) ?? typoLines[1] ?? '') || 'Inter'

  return { primaryColor, secondaryColor, bgColor, bgAlt, textColor, textSecondary, headlineFont, bodyFont }
}

interface ParsedCopy {
  headline: string
  subheadline: string
  lead: string
  problemSection: string[]
  solutionSection: string[]
  deliverables: string[]
  testimonials: string[]
  guarantee: string
  urgency: string
  ctaMain: string
  ctaText: string
}

function parseCopy(copy: string): ParsedCopy {
  const headlineBlock = extract(copy, 'Headlines', 'Headline')
  const subBlock = extract(copy, 'Subheadline')
  const leadBlock = extract(copy, 'Lead', 'Abertura')
  const problemBlock = extract(copy, 'Agitação', 'Problema') || extractBold(copy, 'Agitação', 'Problema')
  const solutionBlock = extract(copy, 'Revelação', 'Solução') || extractBold(copy, 'Revelação', 'Solução')
  const delivBlock = extract(copy, 'o que você vai receber', 'entregáveis', 'receber') || extractBold(copy, 'o que você vai receber', 'entregáveis', 'receber')
  const proofBlock = extract(copy, 'Prova Social', 'Depoimentos', 'Testemunhos') || extractBold(copy, 'Prova Social', 'Depoimentos', 'Testemunhos')
  const guaranteeBlock = extract(copy, 'Garantia') || extractBold(copy, 'Garantia')
  const urgencyBlock = extract(copy, 'Urgência', 'Escassez') || extractBold(copy, 'Urgência', 'Escassez')
  const ctaBlock = extract(copy, 'CTA', 'Call-to-Action', 'Botão')

  const headlines = allBullets(headlineBlock)
  const headline = headlines[0] ?? 'Transforme Seus Resultados Agora'
  const subheadline = firstBullet(subBlock) || 'A solução definitiva para quem está pronto para mudar.'

  const lead = leadBlock.split('\n').filter(Boolean).slice(0, 4).join(' ') || ''

  const problemLines = allBullets(problemBlock).slice(0, 4)
  const solutionLines = allBullets(solutionBlock).slice(0, 4)
  const deliverables = allBullets(delivBlock).slice(0, 6)

  // Parse testimonials: look for quoted text or numbered blocks
  const testimonials: string[] = []
  const tBlocks = proofBlock.split(/\n(?=\d+\.|Depoimento|\*\*)/i).filter(Boolean)
  for (const b of tBlocks.slice(0, 3)) {
    const name = b.match(/\*\*([^*]+)\*\*/) ?? b.match(/—\s*(.+)/)
    const text = b.replace(/\*\*[^*]+\*\*/g, '').replace(/^[\d.]+/, '').trim().split('\n')[0]
    if (text) testimonials.push(name ? `"${text}" — ${name[1]}` : `"${text}"`)
  }

  const guarantee = guaranteeBlock.split('\n').filter(Boolean).slice(0, 8).join(' ') || '7 dias de garantia incondicional.'
  const urgency = firstBullet(urgencyBlock) || ''

  const ctaLines = allBullets(ctaBlock)
  const ctaMain = ctaLines[0] ?? 'Quero Começar Agora'
  const ctaText = ctaLines[1] ?? 'Acesso imediato após a confirmação'

  return { headline, subheadline, lead, problemSection: problemLines, solutionSection: solutionLines, deliverables, testimonials, guarantee, urgency, ctaMain, ctaText }
}

function ticketBadge(tier: string, price: string): string {
  if (tier === 'high') return ''
  if (!price || price === 'Não informado') return ''
  return `<div class="price-badge">
    <span class="price-from">De <s>R$ ${multiplyPrice(price)}</s> por apenas</span>
    <span class="price-main">R$ ${price}</span>
  </div>`
}

function multiplyPrice(raw: string): string {
  const n = parseFloat(raw.replace(/[^0-9,.]/g, '').replace(',', '.'))
  if (isNaN(n)) return raw
  return (n * 3).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function urgencyBanner(tier: string, urgency: string): string {
  if (tier === 'high' || !urgency) return ''
  return `<div class="urgency-bar">${urgency}</div>`
}

function ctaLabel(tier: string, ctaMain: string, price: string): string {
  if (tier === 'high') return ctaMain || 'Solicitar Minha Vaga'
  // Only append price if the agent didn't already include it in ctaMain
  if (tier === 'low' && price && !ctaMain.includes('R$')) return `${ctaMain} — R$ ${price}`
  return ctaMain
}

export function buildSalesPageHtml(data: SalesPageData): string {
  const { onboarding, copy, design } = data
  const { tier } = getTicketStrategy(onboarding.ticket_medio)
  const d = parseDesign(design)
  const c = parseCopy(copy)

  const primaryIsLight = hexLuminance(d.primaryColor) > 0.38
  const heroBg = primaryIsLight
    ? (hexLuminance(d.bgColor) < 0.15 ? d.bgColor : '#0F0F1A')
    : d.primaryColor
  const heroText = contrastColor(heroBg)
  const ctaText = contrastColor(d.primaryColor)
  // Safety: if body text is light on a light background, force dark text
  const bodyText = (hexLuminance(d.textColor) > 0.5 && hexLuminance(d.bgColor) > 0.5)
    ? '#111111'
    : d.textColor

  const gfUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(d.headlineFont)}:wght@400;600;700;800&family=${encodeURIComponent(d.bodyFont)}:wght@400;500;600&display=swap`

  const rawPrice = onboarding.ticket_medio === 'ate-97' ? '97'
    : onboarding.ticket_medio === '97-297' ? '197'
    : onboarding.ticket_medio === '297-997' ? '497'
    : ''

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${onboarding.produto}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link href="${gfUrl}" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --primary: ${d.primaryColor};
      --secondary: ${d.secondaryColor};
      --bg: ${d.bgColor};
      --bg-alt: ${d.bgAlt};
      --text: ${bodyText};
      --text-2: ${d.textSecondary};
      --headline-font: '${d.headlineFont}', system-ui, sans-serif;
      --body-font: '${d.bodyFont}', system-ui, sans-serif;
      --radius: 12px;
      --max-w: 860px;
      --hero-bg: ${heroBg};
      --hero-text: ${heroText};
      --cta-text: ${ctaText};
    }
    body { background: var(--bg); color: var(--text); font-family: var(--body-font); font-size: 17px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
    .container { max-width: var(--max-w); margin: 0 auto; padding: 0 24px; }
    h1, h2, h3 { font-family: var(--headline-font); line-height: 1.2; }

    /* URGENCY */
    .urgency-bar { background: var(--primary); color: var(--cta-text); text-align: center; padding: 12px 24px; font-size: 14px; font-weight: 600; letter-spacing: 0.02em; }

    /* HERO */
    .hero { padding: 80px 0 60px; text-align: center; }
    .hero .section-label { color: var(--hero-text); opacity: 0.75; }
    .hero h1 { font-size: clamp(2rem, 5vw, 3.25rem); font-weight: 800; max-width: 820px; margin: 0 auto 20px; color: var(--hero-text); }
    .hero h1 em { font-style: normal; color: var(--secondary); }
    .hero .sub { font-size: 1.15rem; color: var(--hero-text); opacity: 0.85; max-width: 600px; margin: 0 auto 36px; }
    .cta-block { display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .btn-cta { display: inline-block; background: var(--primary); color: var(--cta-text); font-family: var(--headline-font); font-size: 1.1rem; font-weight: 700; padding: 18px 40px; border-radius: var(--radius); text-decoration: none; border: none; cursor: pointer; transition: filter .2s, transform .15s; }
    .btn-cta:hover { filter: brightness(1.1); transform: translateY(-2px); }
    .cta-sub { font-size: 13px; color: var(--text-2); }
    .hero .price-from { color: var(--hero-text); opacity: 0.7; }
    .hero .price-main { color: var(--hero-text); }
    .hero .cta-sub { color: var(--hero-text); opacity: 0.7; }

    /* PRICE BADGE */
    .price-badge { display: flex; flex-direction: column; align-items: center; gap: 4px; margin-bottom: 16px; }
    .price-from { font-size: 13px; color: var(--text-2); }
    .price-main { font-size: 2.5rem; font-weight: 800; font-family: var(--headline-font); color: var(--text); }

    /* LEAD */
    .lead-section { padding: 56px 0; }
    .lead-section p { font-size: 1.1rem; color: var(--text-2); max-width: 700px; margin: 0 auto; text-align: center; }

    /* SECTION */
    section { padding: 72px 0; }
    section.alt { background: var(--bg-alt); }
    .section-label { font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--primary); margin-bottom: 12px; }
    .section-title { font-size: clamp(1.5rem, 3.5vw, 2.25rem); font-weight: 700; margin-bottom: 28px; }
    .section-body { color: var(--text-2); font-size: 1rem; }

    /* BULLETS */
    .bullet-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
    .bullet-list li { display: flex; align-items: flex-start; gap: 12px; }
    .bullet-list li::before { content: '✓'; display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; background: var(--primary); color: var(--cta-text); border-radius: 50%; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 2px; }

    /* TESTIMONIALS */
    .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
    .testimonial-card { background: var(--bg); border: 1px solid rgba(255,255,255,.07); border-radius: var(--radius); padding: 24px; }
    .testimonial-card p { font-size: 0.95rem; color: var(--text-2); margin-bottom: 14px; font-style: italic; }
    .testimonial-author { font-size: 13px; font-weight: 600; color: var(--text); }
    .stars { color: var(--primary); font-size: 14px; margin-bottom: 10px; }

    /* GUARANTEE */
    .guarantee-box { display: flex; align-items: flex-start; gap: 24px; background: var(--bg-alt); border: 1px solid rgba(255,255,255,.07); border-radius: var(--radius); padding: 32px; max-width: 640px; margin: 0 auto; }
    .guarantee-icon { font-size: 3rem; flex-shrink: 0; }
    .guarantee-text h3 { font-size: 1.2rem; margin-bottom: 8px; }
    .guarantee-text p { font-size: 0.95rem; color: var(--text-2); }

    /* FOOTER CTA */
    .footer-cta { background: var(--bg-alt); padding: 80px 0; text-align: center; }
    .footer-cta h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; margin-bottom: 12px; }
    .footer-cta p { color: var(--text-2); margin-bottom: 36px; }

    /* FOOTER */
    footer { padding: 32px 0; border-top: 1px solid rgba(255,255,255,.06); text-align: center; }
    footer p { font-size: 13px; color: var(--text-2); }

    @media (max-width: 600px) {
      .hero { padding: 56px 0 40px; }
      .guarantee-box { flex-direction: column; }
      .testimonials-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

${urgencyBanner(tier, c.urgency)}

<!-- HERO -->
<section class="hero" style="background: var(--hero-bg);">
  <div class="container">
    <p class="section-label">${onboarding.nicho}</p>
    <h1>${c.headline.replace(/\*\*/g, '')}</h1>
    <p class="sub">${c.subheadline.replace(/\*\*/g, '')}</p>
    ${ticketBadge(tier, rawPrice)}
    <div class="cta-block">
      <a href="#oferta" class="btn-cta">${ctaLabel(tier, c.ctaMain, rawPrice)}</a>
      <span class="cta-sub">${c.ctaText}</span>
    </div>
  </div>
</section>

${c.lead ? `<!-- LEAD -->
<div class="lead-section">
  <div class="container">
    <p>${c.lead}</p>
  </div>
</div>` : ''}

<!-- PROBLEMA -->
<section>
  <div class="container">
    <p class="section-label">O Problema</p>
    <h2 class="section-title">Você já se sentiu assim?</h2>
    ${c.problemSection.length > 0 ? `<ul class="bullet-list">${c.problemSection.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}
  </div>
</section>

<!-- SOLUÇÃO -->
<section class="alt">
  <div class="container">
    <p class="section-label">A Solução</p>
    <h2 class="section-title">Apresentando: ${onboarding.produto}</h2>
    ${c.solutionSection.length > 0 ? `<ul class="bullet-list">${c.solutionSection.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}
  </div>
</section>

<!-- ENTREGÁVEIS -->
${c.deliverables.length > 0 ? `<section>
  <div class="container">
    <p class="section-label">O que está incluso</p>
    <h2 class="section-title">Tudo que você recebe</h2>
    <ul class="bullet-list">${c.deliverables.map((l) => `<li>${l}</li>`).join('')}</ul>
  </div>
</section>` : ''}

<!-- PROVA SOCIAL -->
${c.testimonials.length > 0 ? `<section class="alt">
  <div class="container">
    <p class="section-label">Quem já transformou</p>
    <h2 class="section-title" style="margin-bottom: 40px;">Resultados reais de alunos reais</h2>
    <div class="testimonials-grid">
      ${c.testimonials.map((t) => {
        const parts = t.split(' — ')
        const quote = parts[0].replace(/^"|"$/g, '')
        const author = parts[1] ?? 'Aluno verificado'
        return `<div class="testimonial-card">
          <div class="stars">★★★★★</div>
          <p>"${quote}"</p>
          <span class="testimonial-author">— ${author}</span>
        </div>`
      }).join('')}
    </div>
  </div>
</section>` : ''}

<!-- GARANTIA -->
<section id="oferta">
  <div class="container">
    <p class="section-label" style="text-align:center">Risco zero</p>
    <h2 class="section-title" style="text-align:center; margin-bottom:32px">Garantia incondicional</h2>
    <div class="guarantee-box">
      <span class="guarantee-icon">🛡️</span>
      <div class="guarantee-text">
        <h3>Sua satisfação garantida</h3>
        <p>${c.guarantee}</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA FINAL -->
<div class="footer-cta">
  <div class="container">
    <h2>Chegou a sua vez de transformar.</h2>
    <p>${tier === 'high' ? 'Dê o próximo passo e agende sua conversa.' : 'Acesso imediato. Sem riscos.'}</p>
    ${ticketBadge(tier, rawPrice)}
    <div class="cta-block">
      <a href="#" class="btn-cta">${ctaLabel(tier, c.ctaMain, rawPrice)}</a>
      <span class="cta-sub">${c.ctaText}</span>
    </div>
  </div>
</div>

<footer>
  <div class="container">
    <p>© ${new Date().getFullYear()} ${onboarding.produto}. Todos os direitos reservados.</p>
  </div>
</footer>

</body>
</html>`
}
