/** 房贷计算数据层:纯数学公式 + 各州有效房产税率(官方 CC BY 4.0 数据集)。
 *  月供公式 P×r(1+r)^n / ((1+r)^n − 1) 是确定性数学,非估算;税率来自官方统计,页面明示口径。 */

import { TAX_ROWS } from '@/lib/tax-table'

export interface StateTax {
  state: string
  abbr: string
  year: number
  /** 有效房产税率(%/年,中位实缴÷中位房价) */
  rate: number
  medianHome: number
  medianTax: number
  rank: number
}

const TAX: StateTax[] = TAX_ROWS.sort((a, b) => a.state.localeCompare(b.state))
const BY_ABBR = new Map(TAX.map((t) => [t.abbr, t]))
const BY_SLUG = new Map(TAX.map((t) => [t.state.toLowerCase().replace(/\s+/g, '-'), t]))

export function allStates(): StateTax[] {
  return TAX
}

export function stateBySlug(slug: string): StateTax | null {
  return BY_SLUG.get(slug) ?? null
}

export function highestRate(): StateTax {
  return [...TAX].sort((a, b) => b.rate - a.rate)[0]
}

export function lowestRate(): StateTax {
  return [...TAX].sort((a, b) => a.rate - b.rate)[0]
}

/** 月供 P&I:P×r(1+r)^n/((1+r)^n−1);r=年利率/12,n=月数。纯数学。 */
export function monthlyPI(principal: number, annualRatePct: number, years: number): number {
  const r = annualRatePct / 100 / 12
  const n = years * 12
  if (n === 0) return 0
  if (r === 0) return principal / n
  const f = Math.pow(1 + r, n)
  return (principal * r * f) / (f - 1)
}

export interface PaymentBreakdown {
  loan: number
  piMonthly: number
  taxMonthly: number | null
  insuranceMonthly: number | null
  totalMonthly: number | null
}

/** 全月供 = P&I + 房产税(州有效税率×房价/12)+ 保险(可选年保费/12)。 */
export function breakdown(opts: {
  homePrice: number
  downPct: number
  ratePct: number
  years: number
  taxRatePct?: number | null
  insuranceYearly?: number | null
}): PaymentBreakdown {
  const loan = opts.homePrice * (1 - opts.downPct / 100)
  const pi = monthlyPI(loan, opts.ratePct, opts.years)
  const tax = opts.taxRatePct != null ? (opts.homePrice * opts.taxRatePct / 100) / 12 : null
  const ins = opts.insuranceYearly != null ? opts.insuranceYearly / 12 : null
  const total = pi + (tax ?? 0) + (ins ?? 0)
  return { loan, piMonthly: pi, taxMonthly: tax, insuranceMonthly: ins, totalMonthly: total }
}

/** 首年利息/本金拆分(等额本息,逐月推演)。 */
export function firstYearSplit(loan: number, ratePct: number, years: number): { interest: number; principal: number } {
  const r = ratePct / 100 / 12
  const n = years * 12
  const pay = monthlyPI(loan, ratePct, years)
  let bal = loan
  let interest = 0
  let principal = 0
  for (let i = 0; i < 12 && i < n; i += 1) {
    const int = bal * r
    const pri = pay - int
    interest += int
    principal += pri
    bal -= pri
  }
  return { interest: Math.round(interest * 100) / 100, principal: Math.round(principal * 100) / 100 }
}
