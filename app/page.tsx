import Link from 'next/link'
import type { Metadata } from 'next'
import AdSlot from '@/components/AdSlot'
import MortgageCalc from '@/components/MortgageCalc'
import { jsonLdScript } from '@/lib/jsonld'
import { BASE, SITE_NAME } from '@/lib/site'
import { highestRate, lowestRate } from '@/lib/mortgage'

export const revalidate = 604800

export const metadata: Metadata = {
  title: 'Mortgage Calculator — Monthly Payment with State Property Tax',
  description: 'Free instant mortgage calculator: monthly payment with principal & interest, plus real state-level property tax rates. Standard amortization formula, no sign-up.',
  alternates: { canonical: '/' },
}

export default function Home() {
  const hi = highestRate()
  const lo = lowestRate()
  const faqLd = jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How is the monthly mortgage payment calculated?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Principal & interest use the standard amortization formula: P × r(1+r)ⁿ ÷ ((1+r)ⁿ − 1), where P is the loan amount, r is the monthly rate and n the number of months. Property tax is added using your state\u2019s effective rate; insurance is optional.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which states have the highest and lowest property taxes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Effective property-tax rates range from ${lo.rate}% in ${lo.state} (lowest) to ${hi.rate}% in ${hi.state} (highest), based on Census ACS 2024 median taxes paid over median home values.`,
        },
      },
    ],
  })

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />

      <p className="text-[13px] font-semibold uppercase tracking-widest text-brand">
        Standard amortization · real state tax rates
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Mortgage calculator</h1>
      <p className="mt-3 text-[15px] text-ink/65">
        Instant monthly payment with principal &amp; interest plus property tax at your
        state&rsquo;s effective rate. The math is the standard amortization formula — no sign-up,
        runs in your browser.
      </p>

      <div className="mt-6">
        <MortgageCalc />
      </div>

      <AdSlot slot="home-below-calc" />

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Property tax varies 6× by state</h2>
        <p className="mt-2 text-[14px] text-ink/65">
          On the same $350,000 home, annual property tax is about{' '}
          <strong>${Math.round(350_000 * lo.rate / 100).toLocaleString('en-US')}</strong> in {lo.state} ({lo.rate}%)
          versus <strong>${Math.round(350_000 * hi.rate / 100).toLocaleString('en-US')}</strong> in {hi.state} ({hi.rate}%) —
          a difference that changes the monthly payment by hundreds of dollars. Pick your state for
          prefilled, sourced defaults:
        </p>
        <Link
          href="/states"
          className="mt-4 inline-block rounded-lg bg-ink px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-ink/85"
        >
          Mortgage calculator by state →
        </Link>
      </section>
    </div>
  )
}
