import { streamFromPageModel } from '../pageModel'

export async function runRefineHtml(html: string, instrucao: string): Promise<string> {
  const prompt = `Você é um editor de páginas de venda em HTML. Recebe uma página HTML completa e uma instrução de ajuste. Aplique APENAS o que foi pedido e devolva a página HTML COMPLETA modificada.

REGRAS:
- Altere SOMENTE o que a instrução pede. Todo o resto deve permanecer IDÊNTICO — mesmas seções, mesmo CSS dentro do <style>, mesmas cores, mesmo conteúdo não mencionado.
- Não reescreva a página inteira. Não invente dados novos (depoimentos, números, nomes, logos).
- Mantenha o documento válido e completo: <!DOCTYPE html> ... </html>, com o <style> e tudo dentro.
- Não adicione comentários explicando a mudança.
- RESPONDA APENAS COM O HTML. Sem markdown, sem crase tripla, sem texto antes/depois. Comece em <!DOCTYPE html>.

INSTRUÇÃO DO USUÁRIO:
"${instrucao}"

HTML ATUAL:
${html}`

  let full = ''
  for await (const chunk of streamFromPageModel(prompt)) full += chunk

  let out = full.trim()
  const fence = out.match(/```(?:html)?\s*([\s\S]*?)```/i)
  if (fence) out = fence[1].trim()
  const idx = out.search(/<!DOCTYPE|<html/i)
  if (idx > 0) out = out.slice(idx)
  if (!/<html/i.test(out)) throw new Error('refineHtml: resposta não contém HTML válido')
  return out
}
