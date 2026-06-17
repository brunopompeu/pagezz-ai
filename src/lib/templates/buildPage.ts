import { themes } from './themes'
import { heroA } from './heroes/hero-a'
import { heroB } from './heroes/hero-b'
import { lowTicketStructure } from './structures/low-ticket'
import { authorityStructure } from './structures/authority'
import { qualificationStructure } from './structures/qualification'
import type { PageData, ThemeName, StructureName } from './types'

function getThemeCss(theme: ThemeName): string {
  const t = themes[theme]
  return `:root {
  --primary: ${t.primary};
  --primary-dk: ${t.primaryDk};
  --accent: ${t.accent};
  --bg: ${t.bg};
  --bg-alt: ${t.bgAlt};
  --bg-dark: ${t.bgDark};
  --text: ${t.text};
  --text-2: ${t.text2};
  --text-inv: ${t.textInv};
  --font-headline: ${t.fontHeadline};
  --font-body: ${t.fontBody};
}`
}

function getStructureBody(structure: StructureName): string {
  switch (structure) {
    case 'low-ticket': return lowTicketStructure()
    case 'authority': return authorityStructure()
    case 'qualification': return qualificationStructure()
  }
}

function substituteTokens(html: string, data: PageData): string {
  const map: Record<string, string> = {
    NOME_PRODUTO: data.nomeProduto ?? '',
    NOME_PRODUTOR: data.nomeProdutor ?? '',
    NICHO: data.nicho ?? '',
    HEADLINE: data.headline ?? '',
    SUBHEADLINE: data.subheadline ?? '',
    TEXTO_AGITACAO: data.agitacaoProblema ?? '',
    REVELACAO_SOLUCAO: data.revelacaoSolucao ?? '',
    TEXTO_CTA: data.textoCta ?? '',
    PRECO: data.preco ?? '',
    PRECO_DE: data.precoDe ?? '',
    PARCELAMENTO: data.parcelamento ?? '',
    GARANTIA: data.garantia ?? '',
    TITULO_GARANTIA: data.garantia ?? '',
    TEXTO_GARANTIA: data.garantia ?? '',
    URGENCIA: data.urgencia ?? '',
    CITACAO_PRODUTOR: data.citacaoProdutor ?? '',
    HEADLINE_FINAL: data.headlineFinal ?? data.headline ?? '',
    NUM_ANOS: data.numAnos ?? '',
    NUM_CLIENTES: data.numClientes ?? '',
    NUM_RESULTADO: data.numResultado ?? '',
    LABEL_RESULTADO: data.labelResultado ?? '',
    NUM_EXTRA: data.numExtra ?? '',
    LABEL_EXTRA: data.labelExtra ?? '',
    NUM_ALUNOS: data.numClientes ?? '',
    NUM_AVALIACAO: '4.9★',
    NUM_EMPRESAS: data.numEmpresas ?? '',
    NUM_PAISES: data.numPaises ?? '',
    NUM_NPS: data.numNPS ?? '',
    GARANTIA_CARTORIO: data.garantiaCartorio ?? '',
    TITULO_FORMULARIO: data.tituloFormulario ?? '',
    SUBTITULO_FORMULARIO: data.subtituloFormulario ?? '',
    LABEL_QUALIFICACAO_1: data.labelQualificacao1 ?? '',
    BONUS_TITULO: data.bonus?.titulo ?? '',
    BONUS_DESC: data.bonus?.descricao ?? '',
  }

  const entregaveis = data.entregaveis ?? []
  for (let i = 0; i < 4; i++) {
    const e = entregaveis[i]
    map[`ICONE_ENT_${i + 1}`] = e?.icone ?? '📌'
    map[`TITULO_ENT_${i + 1}`] = e?.titulo ?? ''
    map[`DESC_ENT_${i + 1}`] = e?.descricao ?? ''
  }

  if (data.entregaveis?.length) {
    for (let i = 0; i < 4; i++) {
      const e = data.entregaveis[i]
      map[`ICONE_${i + 1}`] = e?.icone ?? '✦'
      map[`TITULO_SOL_${i + 1}`] = e?.titulo ?? ''
      map[`DESC_SOL_${i + 1}`] = e?.descricao ?? ''
    }
  }

  const depoimentos = data.depoimentos ?? []
  for (let i = 0; i < 3; i++) {
    const d = depoimentos[i]
    map[`DEPOIMENTO_${i + 1}`] = d?.texto ?? ''
    map[`NOME_ALUNO_${i + 1}`] = d?.nome ?? ''
    map[`DESC_ALUNO_${i + 1}`] = d?.descricao ?? ''
    map[`RESULTADO_${i + 1}`] = d?.resultado ?? ''
    map[`EMPRESA_CASE_${i + 1}`] = d?.descricao ?? ''
    map[`EMPRESA_${i + 1}`] = d?.nome ?? ''
  }

  const parasQuem = data.paraQuemE ?? []
  for (let i = 0; i < 3; i++) map[`PARA_QUEM_${i + 1}`] = parasQuem[i] ?? ''

  const naoParaQuem = data.naoParaQuem ?? []
  for (let i = 0; i < 3; i++) map[`NAO_PARA_${i + 1}`] = naoParaQuem[i] ?? ''

  const faq = data.faq ?? []
  for (let i = 0; i < 3; i++) {
    map[`FAQ_P${i + 1}`] = faq[i]?.pergunta ?? ''
    map[`FAQ_R${i + 1}`] = faq[i]?.resposta ?? ''
  }

  const dores = data.dorsQualificacao ?? []
  for (let i = 0; i < 4; i++) {
    map[`DOR_${i + 1}`] = dores[i] ?? ''
    map[`DESC_DOR_${i + 1}`] = dores[i] ?? ''
    map[`ICONE_DOR_${i + 1}`] = '⚡'
  }

  const midias = data.midias ?? []
  for (let i = 0; i < 4; i++) map[`MIDIA_${i + 1}`] = midias[i] ?? ''

  const opcoes = data.opcoesQualificacao ?? []
  for (let i = 0; i < 3; i++) map[`OPCAO_QUALIFICACAO_${i + 1}`] = opcoes[i] ?? ''

  const stat1 = { num: data.numClientes ?? '', label: 'alunos' }
  const stat2 = { num: data.numResultado ?? '', label: data.labelResultado ?? '' }
  const stat3 = { num: data.numAnos ?? '', label: 'anos' }
  map['STAT_1_NUM'] = stat1.num; map['STAT_1_LABEL'] = stat1.label
  map['STAT_2_NUM'] = stat2.num; map['STAT_2_LABEL'] = stat2.label
  map['STAT_3_NUM'] = stat3.num; map['STAT_3_LABEL'] = stat3.label

  let result = html
  for (const [key, value] of Object.entries(map)) {
    result = result.replaceAll(`{{${key}}}`, value)
  }
  return result
}

export function buildPage(data: PageData): string {
  const theme = themes[data.theme]
  const hero = data.heroStyle === 'b' ? heroB(data.structure) : heroA(data.structure)
  const structure = getStructureBody(data.structure)

  const bodyWithHero = structure
    .replace('{{HERO_CSS_SLOT}}', `<style>${hero.css}</style>`)
    .replace('{{HERO_SLOT}}', hero.html)

  const bodyTokenized = substituteTokens(bodyWithHero, data)

  const faqScript = `
<script>
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement
    const isOpen = item.classList.contains('open')
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'))
    if (!isOpen) item.classList.add('open')
  })
})
</script>
<style>
.faq-item .faq-a { display: none; }
.faq-item.open .faq-a { display: block; }
.faq-item.open .faq-q::after { content: '−'; }
</style>`

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.headline || data.nomeProduto}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${theme.fontUrl}" rel="stylesheet" />
  <style>
${getThemeCss(data.theme)}
  </style>
</head>
<body data-theme="${data.theme}" data-structure="${data.structure}" data-hero="${data.heroStyle}">
${bodyTokenized}
${faqScript}
</body>
</html>`
}
