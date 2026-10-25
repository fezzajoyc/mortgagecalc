import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-[13px] font-semibold uppercase tracking-widest text-brand">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/states" className="rounded-lg border border-ink/15 bg-white px-4 py-2 text-[14px] font-semibold hover:border-ink/40">Calculators by state</Link>
        <Link href="/" className="rounded-lg bg-ink px-4 py-2 text-[14px] font-semibold text-white hover:bg-ink/85">Main calculator</Link>
      </div>
    </div>
  )
}
