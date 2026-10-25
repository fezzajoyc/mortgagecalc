'use client'

import { useMemo, useState } from 'react'
import { breakdown } from '@/lib/mortgage'
import { money } from '@/lib/site'

/** 房贷计算器(纯客户端即时计算):P&I 公式 + 州有效税率预填 + 保险可选项。 */
export default function MortgageCalc({
  defaultHome = 350_000,
  defaultDownPct = 20,
  defaultRate = 6.5,
  defaultYears = 30,
  defaultTaxRate,
  defaultInsurance = 1_500,
}: {
  defaultHome?: number
  defaultDownPct?: number
  defaultRate?: number
  defaultYears?: number
  defaultTaxRate?: number | null
  defaultInsurance?: number | null
}) {
  const [home, setHome] = useState(defaultHome)
  const [down, setDown] = useState(defaultDownPct)
  const [rate, setRate] = useState(defaultRate)
  const [years, setYears] = useState(defaultYears)
  const [taxRate, setTaxRate] = useState<number>(defaultTaxRate ?? 0)
  const [ins, setIns] = useState<number>(defaultInsurance ?? 0)

  const b = useMemo(
    () => breakdown({ homePrice: home, downPct: down, ratePct: rate, years, taxRatePct: taxRate || null, insuranceYearly: ins || null }),
    [home, down, rate, years, taxRate, ins],
  )

  const inputCls = 'w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-[14px] focus:border-brand focus:outline-none'
  const labelCls = 'block text-[12px] font-medium uppercase tracking-wider text-ink/45 mb-1'

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="home">Home price ($)</label>
          <input id="home" type="number" className={inputCls} value={home} min={10_000} step={5000}
            onChange={(e) => setHome(Math.max(0, Number(e.target.value)))} />
        </div>
        <div>
          <label className={labelCls} htmlFor="down">Down payment (%)</label>
          <input id="down" type="number" className={inputCls} value={down} min={0} max={95} step={1}
            onChange={(e) => setDown(Math.min(95, Math.max(0, Number(e.target.value))))} />
        </div>
        <div>
          <label className={labelCls} htmlFor="rate">Interest rate (%/year)</label>
          <input id="rate" type="number" className={inputCls} value={rate} min={0} max={25} step={0.01}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value)))} />
        </div>
        <div>
          <label className={labelCls} htmlFor="years">Term (years)</label>
          <select id="years" className={inputCls} value={years} onChange={(e) => setYears(Number(e.target.value))}>
            {[30, 20, 15, 10].map((y) => <option key={y} value={y}>{y} years</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="tax">Property tax rate (%/year, effective)</label>
          <input id="tax" type="number" className={inputCls} value={taxRate} min={0} max={4} step={0.01}
            onChange={(e) => setTaxRate(Math.max(0, Number(e.target.value)))} />
        </div>
        <div>
          <label className={labelCls} htmlFor="ins">Home insurance ($/year, optional)</label>
          <input id="ins" type="number" className={inputCls} value={ins} min={0} step={100}
            onChange={(e) => setIns(Math.max(0, Number(e.target.value)))} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-brand/30 bg-brand/5 p-4">
          <div className="text-[12px] text-ink/50">Total monthly (P&I + tax + insurance)</div>
          <div className="mt-1 text-2xl font-bold text-brand">
            {b.totalMonthly != null ? `$${Math.round(b.totalMonthly).toLocaleString('en-US')}` : '—'}
          </div>
        </div>
        <div className="rounded-xl border border-ink/10 bg-white p-4">
          <div className="text-[12px] text-ink/50">Principal & interest</div>
          <div className="mt-1 text-xl font-bold">${Math.round(b.piMonthly).toLocaleString('en-US')}/mo</div>
        </div>
        <div className="rounded-xl border border-ink/10 bg-white p-4">
          <div className="text-[12px] text-ink/50">Loan amount</div>
          <div className="mt-1 text-xl font-bold">{money(b.loan)}</div>
          <div className="text-[11px] text-ink/40">{down}% down</div>
        </div>
      </div>

      <p className="mt-3 text-[12px] text-ink/50">
        Formula: P × r(1+r)ⁿ ÷ ((1+r)ⁿ − 1), where r = rate ÷ 12, n = months. Estimate only — not a
        loan offer; actual escrow may include PMI and HOA.
      </p>
    </div>
  )
}

