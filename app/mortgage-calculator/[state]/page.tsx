import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AdSlot from '@/components/AdSlot'
import MortgageCalc from '@/components/MortgageCalc'
import { jsonLdScript } from '@/lib/jsonld'
import { BASE, money } from '@/lib/site'
import { allStates, stateBySlug } from '@/lib/mortgage'

/** 州页长尾矩阵:"mortgage calculator texas" ×51。州中位房价+有效税率预填。 */
export const revalidate = 604800

export function generateStaticParams() {
  return allStates().map((s) => ({ state: s.state.toLowerCase().replace(/\s+/g, '-') }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>
}): Promise<Metadata> {
  const { state } = await params
  const s = stateBySlug(state)
  if (!s) return {}
  return {
    title: `Mortgage Calculator ${s.state} — With ${s.state} Property Tax (${s.rate}%)`,
    description: `Free mortgage calculator for ${s.state}: instant monthly payment with principal & interest plus ${s.state}'s effective property tax (${s.rate}% on a median home of ${money(s.medianHome)}). Standard amortization formula.`,
    alternates: { canonical: `/mortgage-calculator/${s.state.toLowerCase().replace(/\s+/g, '-')}` },
  }
}

export default async function StateCalcPage({
  params,
}: {
  params: Promise<{ state: string }>
}) {
  const { state } = await params
  const s = stateBySlug(state)
  if (!s) notFound()

  const faqLd = jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the property tax rate in ${s.state}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${s.state}'s effective property-tax rate is ${s.rate}% — median taxes paid of ${money(s.medianTax)} on a median home value of ${money(s.medianHome)} (Census ACS 2024, rank #${s.rank} of 51).`,
        },
      },
      {
        '@type': 'Question',
        name: `How much is the monthly payment on a ${money(s.medianHome)} home in ${s.state}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `At 6.5% for 30 years with 20% down, principal & interest on ${money(s.medianHome * 0.8)} is about $${Math.round(mortgagePIApprox(s.medianHome * 0.8)).toLocaleString('en-US')}/mo, plus roughly $${Math.round(s.medianTax / 12).toLocaleString('en-US')}/mo property tax. Use the calculator for your exact inputs.`,
        },
      },
    ],
  })

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />

      <p className="text-[13px] font-semibold uppercase tracking-widest text-brand">
        {s.state} · effective property tax {s.rate}% · rank #{s.rank} of 51
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Mortgage calculator for {s.state}
      </h1>
      <p className="mt-3 text-[15px] text-ink/65">
        Prefilled with {s.state} medians: home value {money(s.medianHome)}, effective property tax{' '}
        {s.rate}% (≈ {money(s.medianTax)}/yr on the median home). Edit anything — the math updates
        instantly.
      </p>

      <div className="mt-6">
        <MortgageCalc defaultHome={s.medianHome} defaultTaxRate={s.rate} />
      </div>

      <AdSlot slot="state-below-calc" />

      <section className="mt-10 rounded-xl border border-ink/10 bg-white p-5">
        <h2 className="text-[15px] font-semibold">{s.state} property tax facts</h2>
        <dl className="mt-3 grid gap-3 text-[14px] sm:grid-cols-2">
          <div>
            <dt className="text-ink/55">Effective rate (2026, ACS 2024)</dt>
            <dd className="text-lg font-semibold">{s.rate}%</dd>
          </div>
          <div>
            <dt className="text-ink/55">Median home value</dt>
            <dd className="text-lg font-semibold">{money(s.medianHome)}</dd>
          </div>
          <div>
            <dt className="text-ink/55">Median annual taxes paid</dt>
            <dd className="text-lg font-semibold">{money(s.medianTax)}</dd>
          </div>
          <div>
            <dt className="text-ink/55">Rank (1 = highest rate)</dt>
            <dd className="text-lg font-semibold">#{s.rank} of 51</dd>
          </div>
        </dl>
        <p className="mt-3 text-[12px] text-ink/50">
          Effective rate = median real-estate taxes paid ÷ median owner-occupied home value, Census
          ACS 2024 via the StateTakeHome.com dataset (CC BY 4.0). Your actual rate depends on your
          county and municipality.
        </p>
      </section>

      <nav className="mt-8">
        <Link href="/states" className="rounded-lg border border-ink/15 px-4 py-2 text-[14px] font-semibold hover:border-ink/40">
          All states →
        </Link>
      </nav>
    </div>
  )
}

function mortgagePIApprox(loan: number): number {
  const r = 6.5 / 100 / 12
  const n = 360
  const f = Math.pow(1 + r, n)
  return (loan * r * f) / (f - 1)
}
