import type { MetadataRoute } from 'next'
import { BASE } from '@/lib/site'
import { allStates } from '@/lib/mortgage'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/states`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...allStates().map((s) => ({
      url: `${BASE}/mortgage-calculator/${s.state.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]
}
