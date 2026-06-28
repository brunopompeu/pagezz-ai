import { buildPage } from './buildPage'
import { selectTemplate } from './selectTemplate'
import type { PageData, StructureName } from './types'
import type { PageContent } from '../agents/pageWriter'

function mapStructure(ticket: string): StructureName {
  if (ticket === 'acima-997') return 'qualification'
  if (ticket === '297-997') return 'authority'
  return 'low-ticket'
}

function injectConversionElements(
  html: string,
  content: PageContent,
  elementos: string[],
): string {
  let injections = ''

  if (elementos.includes('countdown-timer') && content.countdown_mensagem) {
    injections += `
<div id="pz-timer" style="position:fixed;top:0;left:0;right:0;z-index:9999;background:#1a1a2e;color:#fff;text-align:center;padding:10px;font-size:14px;font-family:system-ui,sans-serif">
  ${content.countdown_mensagem} <span id="pz-timer-display" style="font-weight:700;color:#FFC200"></span>
</div>
<style>body{padding-top:44px}</style>
<script>
(function(){var e=Date.now()+86400000,t=document.getElementById("pz-timer-display");function u(){var s=Math.max(0,e-Date.now()),h=Math.floor(s/3600000),m=Math.floor(s%3600000/60000),sc=Math.floor(s%60000/1000);t.textContent=h+"h "+String(m).padStart(2,"0")+"m "+String(sc).padStart(2,"0")+"s";if(s>0)setTimeout(u,1000)}u()})()
</script>`
  }

  if (elementos.includes('social-proof-toast') && content.toast_mensagens?.length) {
    const msgs = JSON.stringify(content.toast_mensagens)
    injections += `
<div id="pz-toast" style="position:fixed;bottom:24px;left:24px;z-index:9998;background:#1e1e2e;color:#fff;border-radius:12px;padding:12px 16px;font-size:13px;font-family:system-ui,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,0.4);max-width:280px;display:none;align-items:center;gap:10px">
  <span style="font-size:20px">✅</span><span id="pz-toast-text"></span>
</div>
<script>
(function(){var msgs=${msgs},i=0,el=document.getElementById("pz-toast"),txt=document.getElementById("pz-toast-text");function show(){txt.textContent=msgs[i%msgs.length];el.style.display="flex";setTimeout(function(){el.style.display="none";i++;setTimeout(show,5000)},4000)}setTimeout(show,3000)})()
</script>`
  }

  if (elementos.includes('sticky-cta')) {
    injections += `
<div id="pz-sticky" style="position:fixed;bottom:0;left:0;right:0;z-index:9997;background:rgba(10,11,20,0.95);backdrop-filter:blur(8px);padding:12px 24px;display:flex;justify-content:center;border-top:1px solid rgba(255,255,255,0.1)">
  <a href="#cta" style="background:#FFC200;color:#0A0B14;font-weight:700;font-size:15px;padding:12px 32px;border-radius:10px;text-decoration:none;font-family:system-ui,sans-serif">
    Quero Começar Agora →
  </a>
</div>
<style>body{padding-bottom:68px}</style>`
  }

  if (!injections) return html

  return html.replace('</body>', `${injections}\n</body>`)
}

function formatPreco(v?: number): string {
  if (typeof v !== 'number') return ''
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function assemblePage(
  content: PageContent,
  briefing: {
    negocio?: { produto?: string; nicho?: string; ticket_medio?: string }
    publico?: { perfil?: string }
    oferta?: {
      entregaveis?: Array<{ nome?: string; formato?: string; descricao?: string }>
      bonus?: Array<{ nome?: string; descricao?: string }>
      garantia?: { dias?: number; descricao?: string }
      preco_avista?: number
      preco_parcelado?: string
      mecanismo_unico?: string
    }
    provas?: {
      depoimentos?: Array<{ nome?: string; resultado?: string; texto?: string }>
      autoridade?: string
    }
  },
  elementosConversao: string[],
): string {
  const ticket = (briefing.negocio?.ticket_medio ?? 'ate-97') as PageData['ticket_medio']
  const nicho = briefing.negocio?.nicho ?? ''
  const template = selectTemplate(ticket, nicho)

  // benefícios → entregáveis: prefere os reais do briefing; senão usa os benefits escritos
  const entregaveisBriefing = (briefing.oferta?.entregaveis ?? []).map((e) => ({
    icone: '✦',
    titulo: e.nome ?? '',
    descricao: e.descricao ?? '',
  }))
  const entregaveis = entregaveisBriefing.length
    ? entregaveisBriefing
    : content.benefits.map((b) => ({ icone: '✦', titulo: b, descricao: '' }))

  const depoimentos = (briefing.provas?.depoimentos ?? []).map((d) => ({
    nome: d.nome ?? '',
    resultado: d.resultado ?? '',
    texto: d.texto ?? '',
  }))

  const data: PageData = {
    nomeProduto: briefing.negocio?.produto ?? '',
    nicho,
    ticket_medio: ticket,
    publico: briefing.publico?.perfil ?? '',
    objetivo: 'venda',

    headline: content.headline,
    subheadline: content.subheadline,
    headlineFinal: content.headline,
    lead: content.social_proof_intro,
    agitacaoProblema: content.pain_points.join(' '),
    revelacaoSolucao: content.mecanismo_descricao,
    entregaveis,
    paraQuemE: content.benefits.slice(0, 3),
    depoimentos,
    dorsQualificacao: content.pain_points,
    garantia: briefing.oferta?.garantia?.descricao ?? content.garantia_texto,
    urgencia: content.urgencia_texto,
    faq: content.faq ?? [],
    textoCta: content.cta_texto,

    preco: formatPreco(briefing.oferta?.preco_avista),
    parcelamento: briefing.oferta?.preco_parcelado ?? '',
    bonus: briefing.oferta?.bonus?.[0]
      ? {
          titulo: briefing.oferta.bonus[0].nome ?? '',
          descricao: briefing.oferta.bonus[0].descricao ?? '',
        }
      : undefined,

    theme: template.theme,
    structure: mapStructure(ticket),
    heroStyle: 'a',
  }

  let html = buildPage(data)
  html = html.replace(/\{\{[A-Z_0-9]+\}\}/g, '')
  html = injectConversionElements(html, content, elementosConversao)
  return html
}
