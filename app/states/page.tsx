import Link from 'next/link'
import type { Metadata } from 'next'
import { allStates } from '@/lib/mortgage'

export const revalidate = 604800

export const metadata: Metadata = {
  title: 'Mortgage Calculator by State — All 50 States + DC',
  description: 'Mortgage calculators prefilled with each state’s median home value and effective property tax rate, from Census ACS 2024 data.',
  alternates: { canonical: '/states' },
}

export default function StatesPage() {
  const states = allStates()
  return (
    <div>
      <p className="text-[13px] font-semibold uppercase tracking-widest text-brand">{states.length} jurisdictions</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Mortgage calculator by state</h1>
      <p className="mt-3 text-[15px] text-ink/65">Each page comes prefilled with that state’s median home value and effective property-tax rate.</p>
      <ul className="mt-8 grid gap-2 sm:grid-cols-2">
        {states.map((s) => (
          <li key={s.abbr} className="rounded-lg border border-ink/10 bg-white px-4 py-3">
            <Link href={`/mortgage-calculator/${s.state.toLowerCase().replace(/\s+/g, '-')}`} className="group flex items-baseline justify-between gap-3">
              <span className="text-[14.5px] font-semibold group-hover:text-brand">{s.state}</span>
              <span className="text-[13px] text-ink/50">tax {s.rate}%</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
