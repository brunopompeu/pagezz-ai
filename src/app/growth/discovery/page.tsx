'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadPageContextFromBriefing } from '@/lib/growth/context'
import type { PageContext } from '@/lib/growth/types'
import { DiscoveryChat } from '@/components/growth/DiscoveryChat'

function DiscoveryPageInner() {
  const searchParams = useSearchParams()
  const rawMode = searchParams.get('mode')

  const [pageContext, setPageContext] = useState<PageContext | null | 'loading'>('loading')

  useEffect(() => {
    setPageContext(loadPageContextFromBriefing())
  }, [])

  if (pageContext === 'loading') return null

  const mode: 'post_page' | 'direct' =
    rawMode === 'post_page' && pageContext !== null ? 'post_page' : 'direct'

  return <DiscoveryChat mode={mode} pageContext={pageContext} />
}

export default function DiscoveryPage() {
  return (
    <Suspense>
      <DiscoveryPageInner />
    </Suspense>
  )
}
