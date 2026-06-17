import OnboardingForm from '@/components/onboarding/OnboardingForm'

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
            Semana 1 · MVP
          </div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">
            Pagezz<span className="text-[var(--primary)]">.AI</span>
          </h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Páginas de venda estratégicas geradas por IA
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <OnboardingForm />
        </div>
      </div>
    </main>
  )
}
