import { NextResponse } from 'next/server'
import type { SalesPageData } from '@/lib/buildSalesPage'
import { buildSalesPageHtml } from '@/lib/buildSalesPage'
import { buildPage, selectTemplate } from '@/lib/templates'
import type { PageData } from '@/lib/templates'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // New template system: PageData has a 'structure' field
    if ('structure' in body && 'theme' in body && 'heroStyle' in body) {
      const data = body as PageData
      const html = buildPage(data)
      return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    }

    // Legacy: build with old system, then optionally wrap with new templates
    if ('onboarding' in body && ('copy' in body || 'design' in body)) {
      const legacy = body as SalesPageData
      const html = buildSalesPageHtml(legacy)
      return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    }

    return NextResponse.json({ error: 'Formato de body inválido.' }, { status: 400 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao gerar página.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
