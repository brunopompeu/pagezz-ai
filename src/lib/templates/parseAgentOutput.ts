import type { OnboardingData } from '@/types'
import { selectTemplate } from './selectTemplate'
import type { PageData } from './types'

function extract(text: string, ...kws: string[]): string {
  for (const kw of kws) {
    const re = new RegExp(String.raw`##[^#\n]*` + kw + String.raw`[^\n]*\n([\s\S]*?)(?=\n##|$)`, 'i')
    const m = text.match(re)
    if (m) return m[1].trim()
  }
  return ''
}

function extractBold(text: string, ...kws: string[]): string {
  for (const kw of kws) {
    const re = new RegExp(String.raw`\*\*[^*\n]*` + kw + String.raw`[^*\n]*\*\*[^\n]*\n([\s\S]*?)(?=\n\*\*|\n##|$)`, 'i')
    const m = text.match(re)
    if (m) return m[1].trim()
  }
  return ''
}

function bullets(block: string): string[] {
  return block.split('\n').map(l => l.replace(/^[-*•\d.]+\s*/, '').trim()).filter(Boolean)
}

function firstBullet(block: string): string {
  return bullets(block)[0] ?? ''
}

export function parseAgentOutputToPageData(
  onboarding: OnboardingData,
  copy: string,
  design: string,
): PageData {
  const tpl = selectTemplate(onboarding.ticket_medio, onboarding.nicho)

  const headlineBlock = extract(copy, 'Headlines', 'Headline')
  const subBlock = extract(copy, 'Subheadline')
  const leadBlock = extract(copy, 'Lead', 'Abertura')
  const problemBlock = extract(copy, 'Agitação', 'Problema') || extractBold(copy, 'Agitação', 'Problema')
  const solutionBlock = extract(copy, 'Revelação', 'Solução') || extractBold(copy, 'Revelação', 'Solução')
  const delivBlock = extract(copy, 'o que você vai receber', 'entregáveis', 'receber') || extractBold(copy, 'receber', 'entregáveis')
  const proofBlock = extract(copy, 'Prova Social', 'Depoimentos') || extractBold(copy, 'Depoimentos')
  const guaranteeBlock = extract(copy, 'Garantia') || extractBold(copy, 'Garantia')
  const urgencyBlock = extract(copy, 'Urgência', 'Escassez') || extractBold(copy, 'Urgência', 'Escassez')
  const ctaBlock = extract(copy, 'CTA', 'Call-to-Action', 'Botão')
  const forWhoBlock = extract(copy, 'Para quem é', 'Para quem') || extractBold(copy, 'Para quem')
  const notForBlock = extract(copy, 'Não é para', 'Não é para quem') || extractBold(copy, 'Não é para')
  const faqBlock = extract(copy, 'FAQ', 'Perguntas Frequentes') || extractBold(copy, 'FAQ', 'Perguntas')
  const bonusBlock = extract(copy, 'Bônus', 'Bonus') || extractBold(copy, 'Bônus')

  const headlines = bullets(headlineBlock)
  const headline = headlines[0] ?? `Transforme seus Resultados com ${onboarding.produto}`
  const subheadline = firstBullet(subBlock) || `A solução definitiva para ${onboarding.publico_alvo}`
  const lead = leadBlock.split('\n').filter(Boolean).slice(0, 3).join(' ')
  const ctaLines = bullets(ctaBlock)
  const textoCta = ctaLines[0] ?? 'Quero Começar Agora'

  const rawPrice = onboarding.ticket_medio === 'ate-97' ? '97'
    : onboarding.ticket_medio === '97-297' ? '197'
    : onboarding.ticket_medio === '297-997' ? '497'
    : ''

  const deliverableLines = bullets(delivBlock).slice(0, 4)
  const entregaveis = deliverableLines.map((l, i) => {
    const icons = ['📌', '🎯', '📚', '⚡']
    return { icone: icons[i] ?? '✦', titulo: l, descricao: '' }
  })

  const proofBlocks = proofBlock.split(/\n(?=\d+\.|Depoimento|\*\*)/i).filter(Boolean)
  const depoimentos = proofBlocks.slice(0, 3).map(b => {
    const nameMatch = b.match(/\*\*([^*]+)\*\*/) ?? b.match(/—\s*(.+)/)
    const text = b.replace(/\*\*[^*]+\*\*/g, '').replace(/^[\d.]+/, '').trim().split('\n')[0] ?? ''
    return { nome: nameMatch?.[1] ?? 'Aluno', resultado: '', texto: text, descricao: '' }
  })

  const faqLines = faqBlock.split(/\n(?=\d+\.|[Pp]ergunta|\*\*)/).filter(Boolean)
  const faq = faqLines.slice(0, 3).map(b => {
    const lines = b.split('\n').filter(Boolean)
    const pergunta = lines[0]?.replace(/^[-*\d.]+\s*/, '').replace(/\*\*/g, '') ?? ''
    const resposta = lines.slice(1).join(' ').replace(/^[-*]\s*/, '') || ''
    return { pergunta, resposta }
  })

  const bonus = bonusBlock ? {
    titulo: firstBullet(bonusBlock) || 'Bônus Especial',
    descricao: bullets(bonusBlock).slice(1).join('. ') || '',
  } : undefined

  const camposSugeridos: string[] = []
  if (!onboarding.produto) camposSugeridos.push('NOME_PRODUTO')

  return {
    nomeProduto: onboarding.produto,
    nicho: onboarding.nicho,
    ticket_medio: onboarding.ticket_medio,
    publico: onboarding.publico_alvo,
    objetivo: onboarding.objetivo_pagina,
    headline,
    subheadline,
    lead,
    agitacaoProblema: bullets(problemBlock).join('\n'),
    revelacaoSolucao: firstBullet(solutionBlock),
    entregaveis,
    paraQuemE: bullets(forWhoBlock).slice(0, 3),
    naoParaQuem: bullets(notForBlock).slice(0, 3),
    depoimentos,
    garantia: guaranteeBlock.split('\n').filter(Boolean).slice(0, 2).join(' ') || '7 dias de garantia incondicional',
    urgencia: firstBullet(urgencyBlock),
    faq,
    textoCta,
    headlineFinal: headlines[1] ?? headline,
    preco: rawPrice,
    precoDe: rawPrice ? String(Math.round(Number(rawPrice) * 2.5)) : '',
    parcelamento: rawPrice ? `ou 12x de R$ ${Math.round(Number(rawPrice) / 12)}` : '',
    bonus,
    camposSugeridos,
    ...tpl,
  }
}
