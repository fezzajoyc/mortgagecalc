#!/usr/bin/env node
/** 线上体检:主计算器/州页/API。 */
const SITE_URL = (process.env.SITE_URL ?? '').replace(/\/+$/, '')
if (!SITE_URL) { console.error('[health] SITE_URL not configured'); process.exit(1) }
const failures = []
const check = async (name, fn) => {
  try { await fn(); console.log(`[health] ✓ ${name}`) } catch (err) {
    failures.push(name); console.error(`[health] ✗ ${name}: ${err.message}`)
  }
}
const get = async (path, timeout = 30_000) => {
  const res = await fetch(`${SITE_URL}${path}`, { signal: AbortSignal.timeout(timeout), headers: { 'User-Agent': 'mortgagecalc-healthcheck' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}
await check('home renders calculator', async () => {
  const html = await get('/')
  if (!/Mortgage calculator/i.test(html)) throw new Error('missing calculator')
  if (!/amortization/i.test(html)) throw new Error('missing formula disclosure')
})
await check('api texas rates', async () => {
  const body = JSON.parse(await get('/api/state?state=texas'))
  if (!body.state?.rate || body.state.rate > 3) throw new Error(`bad rate: ${body.state?.rate}`)
})
await check('texas page renders prefilled', async () => {
  const html = await get('/mortgage-calculator/texas')
  if (!/Texas/i.test(html)) throw new Error('missing state name')
  if (!/effective property tax/i.test(html)) throw new Error('missing tax facts')
})
await check('states directory', async () => {
  const html = await get('/states')
  const count = (html.match(/\/mortgage-calculator\//g) ?? []).length
  if (count < 50) throw new Error(`only ${count} links`)
})
if (failures.length > 0) { console.error(`[health] FAILED: ${failures.join(' | ')}`); process.exit(1) }
console.log('[health] all checks passed')
