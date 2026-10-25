import { NextResponse } from 'next/server'
import { BASE, SITE_NAME } from '@/lib/site'
import { allStates, highestRate, lowestRate } from '@/lib/mortgage'

export const revalidate = 86400

export function GET(): Response {
  const body = `# ${SITE_NAME}

> Mortgage payment calculators for all 51 US jurisdictions, prefilled with each state's median home value and effective property-tax rate (Census ACS 2024).
> Live at ${BASE} . Payment math is the standard amortization formula; tax data CC BY 4.0. AI crawlers and agents are welcome.

## Endpoints

- ${BASE}/api/state — all states with rates
- ${BASE}/api/state?state=texas — one state
- ${BASE}/sitemap.xml — full URL list

## Pages

- / — national mortgage calculator
- /mortgage-calculator/<state-slug> — one page per state, prefilled (e.g. /mortgage-calculator/texas)
- /states — directory

## Facts & policy

- Effective property-tax rate = median taxes paid ÷ median home value (rates ${lowestRate().rate}% in ${lowestRate().state} to ${highestRate().rate}% in ${highestRate().state}).
- Estimates only — not a loan offer or tax advice.
`
  return new NextResponse(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=86400' },
  })
}
