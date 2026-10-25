import { describe, expect, it } from 'vitest'
import { allStates, breakdown, firstYearSplit, highestRate, lowestRate, monthlyPI, stateBySlug } from '@/lib/mortgage'

describe('payment math (deterministic anchors)', () => {
  it('$300,000 at 6.5% for 30y = $1,896.20/mo (standard reference value)', () => {
    expect(monthlyPI(300_000, 6.5, 30)).toBeCloseTo(1896.20, 1)
  })

  it('$500,000 at 3% for 15y ≈ $3,452.91', () => {
    expect(monthlyPI(500_000, 3, 15)).toBeCloseTo(3452.91, 1)
  })

  it('0% rate = straight division', () => {
    expect(monthlyPI(120_000, 0, 10)).toBeCloseTo(1000, 6)
  })

  it('first-year split: interest + principal = 12 payments, balance shrinks', () => {
    const { interest, principal } = firstYearSplit(300_000, 6.5, 30)
    expect(interest + principal).toBeCloseTo(monthlyPI(300_000, 6.5, 30) * 12, 0)
    expect(interest).toBeGreaterThan(principal) // 6.5% 30y 首年利息大头
  })
})

describe('state tax data integrity', () => {
  it('51 jurisdictions, rates in sane bounds', () => {
    expect(allStates().length).toBe(51)
    for (const s of allStates()) {
      expect(s.rate).toBeGreaterThan(0)
      expect(s.rate).toBeLessThan(3)
      expect(s.medianHome).toBeGreaterThan(50_000)
    }
  })

  it('anchors: NJ highest, HI lowest (Tax Foundation/ACS pattern)', () => {
    expect(highestRate().abbr).toBe('NJ')
    expect(lowestRate().abbr).toBe('HI')
  })

  it('stateBySlug resolves; breakdown uses state rate', () => {
    const tx = stateBySlug('texas')!
    expect(tx.abbr).toBe('TX')
    const b = breakdown({ homePrice: tx.medianHome, downPct: 20, ratePct: 6.5, years: 30, taxRatePct: tx.rate })
    expect(b.taxMonthly).toBeCloseTo((tx.medianHome * tx.rate / 100) / 12, 2)
    expect(b.totalMonthly!).toBeGreaterThan(b.piMonthly)
  })
})
