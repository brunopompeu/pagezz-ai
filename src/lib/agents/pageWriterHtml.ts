import { streamFromPageModel } from '../pageModel'
import { themes } from '../templates/themes'
import { selectTemplate } from '../templates/selectTemplate'
import type { ThemeName, StructureName } from '../templates/types'

interface BriefingNarrow {
  negocio?: { produto?: string; nicho?: string; ticket_medio?: string }
}

function themeBlock(theme: ThemeName): { css: string; fontUrl: string } {
  const t = themes[theme]
  return {
    fontUrl: t.fontUrl,
    css: `:root{
  --primary:${t.primary}; --primary-dk:${t.primaryDk}; --accent:${t.accent};
  --bg:${t.bg}; --bg-alt:${t.bgAlt}; --bg-dark:${t.bgDark};
  --text:${t.text}; --text-2:${t.text2}; --text-inv:${t.textInv};
  --font-headline:${t.fontHeadline}; --font-body:${t.fontBody};
}`,
  }
}

const SECTION_GUIDE: Record<StructureName, string> = {
  'low-ticket': `Sequência de seções (OMITA qualquer uma sem dado real):
1. Hero: headline forte, subheadline, botão CTA com o preço visível
2. Faixa de prova com números (só se houver números reais)
3. Problema: título + agitação + lista de 3 dores
4. Solução/mecanismo: título + parágrafo + 3-4 cards de benefício
5. Entregáveis (só se houver entregáveis reais)
6. Depoimentos (só se houver depoimento real — NUNCA invente nome/resultado)
7. Para quem é / não é (duas colunas)
8. Garantia
9. FAQ (só se houver)
10. CTA final com preço grande + botão`,
  authority: `Sequência de seções (OMITA qualquer uma sem dado real):
1. Hero: tag de nicho, headline, números de autoridade (só os que existem), botão CTA
2. Faixa "como visto em" (só se houver mídias reais)
3. Manifesto/citação do produtor (só se houver)
4. Resultados numéricos (só se houver números reais)
5. Problema: título + diagnóstico + lista
6. Metodologia: cards numerados do método/entregáveis
7. Depoimentos (só se houver depoimento real)
8. Bônus (só se houver)
9. Garantia
10. FAQ
11. CTA final SEM preço exposto — chamada para conversa/aplicação`,
  qualification: `Sequência de seções (OMITA qualquer uma sem dado real):
1. Hero: headline de qualificação, números de autoridade (só os reais), CTA para aplicação
2. Faixa de mídia (só se houver)
3. Manifesto do produtor (só se houver)
4. Para quem é / pré-requisitos
5. Problema + diagnóstico
6. Metodologia/processo em etapas
7. Depoimentos (só se houver real)
8. Garantia (se aplicável)
9. FAQ
10. CTA final: formulário/aplicação, SEM preço — "agende uma conversa"`,
}

export async function runPageWriterHtml(
  briefing: BriefingNarrow,
  materiais: Record<string, string>,
  copyStrategy: { promessa_central?: string; arco_emocional?: string; objecoes_principais?: string[] },
  tipoPagina: string,
  elementosConversao: string[],
  temHeroImagem = false,
): Promise<string> {
  const ticket = briefing.negocio?.ticket_medio ?? 'ate-97'
  const nicho = briefing.negocio?.nicho ?? ''
  const { structure, theme } = selectTemplate(ticket, nicho)
  const { css, fontUrl } = themeBlock(theme)

  const prompt = `Você é um designer e copywriter sênior de páginas de venda de alta conversão do mercado digital brasileiro. Sua tarefa: gerar uma página de venda COMPLETA em HTML, pronta para publicar.

═══ DESIGN SYSTEM (OBRIGATÓRIO USAR) ═══
Tema: ${theme} | Estrutura: ${structure} | Tipo de página: ${tipoPagina}

Inclua EXATAMENTE este bloco de variáveis CSS no <style> e use SEMPRE var(--nome) para cores e fontes — nunca cores hardcoded:
${css}

Fonte (inclua no <head>): <link href="${fontUrl}" rel="stylesheet" />

Use var(--font-headline) em títulos e var(--font-body) no corpo. Fundo var(--bg), texto var(--text), destaques var(--primary). A página deve ter visual profissional, espaçamento generoso (seções ~72-100px de padding vertical), container central de ~780-860px, e ser RESPONSIVA (media queries para mobile).

${temHeroImagem
  ? `═══ IMAGEM DE DESTAQUE ═══
O usuário forneceu uma imagem de hero. Inclua no hero EXATAMENTE UMA tag, posicionada de forma elegante (ao lado ou abaixo do texto do hero):
<img src="__HERO_IMAGE__" alt="Imagem de destaque" style="width:100%;max-width:520px;height:auto;border-radius:12px;display:block" />
Use o src LITERAL "__HERO_IMAGE__" — NÃO invente URL. Não adicione nenhuma outra tag <img> na página.`
  : `Não inclua nenhuma tag <img> na página — não há imagens fornecidas.`}

═══ ESTRUTURA ═══
${SECTION_GUIDE[structure]}

═══ DADOS DO NEGÓCIO ═══
BRIEFING:
${JSON.stringify(briefing, null, 2)}

MATERIAIS FORNECIDOS PELO USUÁRIO:
${JSON.stringify(materiais, null, 2)}

ESTRATÉGIA DE COPY:
- Promessa central: ${copyStrategy.promessa_central ?? ''}
- Arco emocional: ${copyStrategy.arco_emocional ?? ''}
- Objeções a atacar: ${(copyStrategy.objecoes_principais ?? []).join(', ')}

ELEMENTOS DE CONVERSÃO (serão injetados depois por código — NÃO gere JS para eles): ${elementosConversao.join(', ') || 'nenhum'}

═══ REGRAS CRÍTICAS ═══
- Escreva TODA a copy final em português brasileiro, persuasiva e específica, seguindo o arco emocional.
- REGRA DE OURO: NUNCA invente depoimentos, nomes de clientes, números de resultado, logos de mídia ou prova social. Se o dado não está no briefing/materiais, OMITA a seção inteira. Página sem seção vazia é melhor que página com placeholder falso.
- PREÇO: se a oferta no briefing tem preco_avista ou preco_parcelado E o tipo de página expõe preço (venda-direta, carta-de-vendas, vsl, squeeze), você DEVE exibir o preço com destaque na seção de oferta/CTA — valor à vista e o parcelamento. Para páginas de alto ticket (high-ticket-consulta, aplicacao, qualificação), NÃO exiba preço: use CTA de conversa/aplicação.
- Não deixe nenhum campo vazio, "lorem ipsum", "[inserir aqui]" ou aspas vazias. Se não tem conteúdo, a seção não existe.
- NÃO inclua JS de countdown/timer/toast/sticky/popup — esses widgets entram por código depois.
- Pode incluir um <script> mínimo só para o accordion do FAQ, se gerar FAQ.
- Documento HTML completo e válido: <!DOCTYPE html>, <html lang="pt-BR">, <head> com meta viewport + fonte + <style>, e <body>.

RESPONDA APENAS COM O HTML. Sem markdown, sem crase tripla, sem explicação. Comece em <!DOCTYPE html>.`

  let full = ''
  for await (const chunk of streamFromPageModel(prompt)) {
    full += chunk
  }

  // Limpa cercas de markdown e lixo antes do doctype
  let html = full.trim()
  const fence = html.match(/```(?:html)?\s*([\s\S]*?)```/i)
  if (fence) html = fence[1].trim()
  const docIdx = html.search(/<!DOCTYPE|<html/i)
  if (docIdx > 0) html = html.slice(docIdx)

  if (!/<html/i.test(html)) throw new Error('pageWriterHtml: resposta não contém HTML válido')
  return html
}
