import Link from 'next/link'
import { TAX_SOURCE } from '@/lib/site'

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto w-full max-w-4xl px-5 py-8 text-[13px] leading-relaxed text-ink/55">
        <p>
          Payment math is the standard amortization formula; property-tax defaults come from the{' '}
          <a href="https://data.mendeley.com/datasets/874s2gsmh9" target="_blank" rel="noopener noreferrer" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            {TAX_SOURCE}
          </a>{' '}
          (effective rate = median taxes paid ÷ median home value). Estimates only — not a loan
          offer, not tax advice. Actual escrow may include PMI, HOA and other costs.
        </p>
        <p className="mt-3">
          <Link href="/sitemap.xml" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">Sitemap</Link> ·{' '}
          <Link href="/llms.txt" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">llms.txt</Link> ·{' '}
          <Link href="/api/state" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">JSON API</Link>
        </p>
      </div>
    </footer>
  )
}
