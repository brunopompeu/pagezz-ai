'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { OnboardingData } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import StepIndicator from './StepIndicator'

const TICKET_OPTIONS = [
  { value: 'ate-97', label: 'Até R$ 97' },
  { value: '97-297', label: 'R$ 97 – R$ 297' },
  { value: '297-997', label: 'R$ 297 – R$ 997' },
  { value: 'acima-997', label: 'Acima de R$ 997' },
]

const TOTAL_STEPS = 5

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
}

export default function OnboardingForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    nicho: '',
    produto: '',
    ticket_medio: '',
    publico_alvo: '',
    objetivo_pagina: 'venda',
  })

  function update<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  function canAdvance() {
    if (step === 0) return data.nicho.trim().length > 0
    if (step === 1) return data.produto.trim().length > 0
    if (step === 2) return data.ticket_medio.length > 0
    if (step === 3) return data.publico_alvo.trim().length > 0
    return true
  }

  function next() {
    if (!canAdvance()) return
    if (step < TOTAL_STEPS - 1) {
      setDirection(1)
      setStep((s) => s + 1)
    } else {
      localStorage.setItem('pagezz_onboarding', JSON.stringify(data))
      router.push('/generate')
    }
  }

  function back() {
    if (step === 0) {
      router.push('/')
    } else {
      setDirection(-1)
      setStep((s) => s - 1)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') next()
  }

  const steps = [
    {
      title: 'Qual é o seu nicho?',
      subtitle: 'Ex: Finanças pessoais, fitness, idiomas, culinária...',
      field: (
        <Input
          label="Nicho de mercado"
          placeholder="Ex: Marketing digital para pequenas empresas"
          value={data.nicho}
          onChange={(e) => update('nicho', e.target.value)}
          onKeyDown={handleKey}
          autoFocus
        />
      ),
    },
    {
      title: 'O que você vende?',
      subtitle: 'Descreva brevemente o seu produto ou serviço.',
      field: (
        <Input
          label="Produto ou serviço"
          placeholder="Ex: Curso online de gestão financeira para autônomos"
          value={data.produto}
          onChange={(e) => update('produto', e.target.value)}
          onKeyDown={handleKey}
          autoFocus
        />
      ),
    },
    {
      title: 'Qual é o ticket médio?',
      subtitle: 'A faixa de preço define a estratégia de copy.',
      field: (
        <Select
          label="Faixa de preço"
          options={TICKET_OPTIONS}
          placeholder="Selecione uma faixa..."
          value={data.ticket_medio}
          onChange={(e) => update('ticket_medio', e.target.value)}
          autoFocus
        />
      ),
    },
    {
      title: 'Quem é o seu público-alvo?',
      subtitle: 'Quanto mais específico, melhor a página gerada.',
      field: (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Público-alvo</label>
          <textarea
            rows={4}
            className="w-full rounded-lg border bg-[var(--surface-elevated)] px-3 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none transition-colors border-[var(--border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] resize-none text-sm"
            placeholder="Ex: Homens de 30–45 anos, autônomos e freelancers que ganham entre R$3k–8k/mês e têm dificuldade de guardar dinheiro..."
            value={data.publico_alvo}
            onChange={(e) => update('publico_alvo', e.target.value)}
            autoFocus
          />
        </div>
      ),
    },
    {
      title: 'Qual é o objetivo da página?',
      subtitle: 'Isso define o tom e a estrutura da copy.',
      field: (
        <div className="flex flex-col gap-3">
          {(['venda', 'obrigado'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => update('objetivo_pagina', opt)}
              className={`
                flex items-start gap-3 rounded-lg border p-4 text-left transition-all duration-150
                ${data.objetivo_pagina === opt
                  ? 'border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]'
                  : 'border-[var(--border)] hover:border-[var(--secondary-light)]'
                }
              `}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  data.objetivo_pagina === opt ? 'border-[var(--primary)]' : 'border-[var(--border)]'
                }`}
              >
                {data.objetivo_pagina === opt && (
                  <span className="block h-2 w-2 rounded-full bg-[var(--primary)]" />
                )}
              </span>
              <span>
                <span className="block font-semibold text-[var(--text-primary)] text-sm">
                  {opt === 'venda' ? 'Página de Venda' : 'Página de Obrigado'}
                </span>
                <span className="block text-xs text-[var(--text-secondary)] mt-0.5">
                  {opt === 'venda'
                    ? 'Persuade e converte visitantes em compradores'
                    : 'Confirma a compra e oferece próximos passos'}
                </span>
              </span>
            </button>
          ))}
        </div>
      ),
    },
  ]

  const current = steps[step]

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator total={TOTAL_STEPS} current={step} />

      <div className="relative min-h-[260px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex flex-col gap-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">{current.title}</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{current.subtitle}</p>
            </div>
            {current.field}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={back}
          className="text-[var(--text-secondary)]"
        >
          Voltar
        </Button>
        <Button
          onClick={next}
          disabled={!canAdvance()}
          size="lg"
        >
          {step === TOTAL_STEPS - 1 ? 'Gerar Página ✨' : 'Próximo'}
        </Button>
      </div>
    </div>
  )
}
