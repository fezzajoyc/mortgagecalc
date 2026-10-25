/** 站点身份与全局常量。 */
export const SITE_NAME = 'MortgageCalc'
export const SITE_TAGLINE = 'Mortgage payment calculator with state property tax'
export const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '')
export const TAX_SOURCE = 'StateTakeHome.com dataset (CC BY 4.0), computed from Census ACS 2024'

export function money(n: number): string {
  return `$${Math.round(n).toLocaleString('en-US')}`
}
