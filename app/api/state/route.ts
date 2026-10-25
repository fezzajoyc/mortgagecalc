import { NextResponse } from 'next/server'
import { allStates, stateBySlug } from '@/lib/mortgage'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('state')
  if (slug) {
    const s = stateBySlug(slug)
    if (!s) return NextResponse.json({ error: 'unknown state' }, { status: 404 })
    return NextResponse.json(
      { state: s, source: 'Census ACS 2024 via StateTakeHome.com dataset (CC BY 4.0)' },
      { headers: { 'access-control-allow-origin': '*', 'cache-control': 'public, max-age=86400' } },
    )
  }
  return NextResponse.json(
    { states: allStates(), usage: '?state=<state-slug> for one state' },
    { headers: { 'access-control-allow-origin': '*' } },
  )
}
