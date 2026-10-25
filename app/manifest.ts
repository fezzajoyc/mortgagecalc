import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MortgageCalc — Mortgage Calculator with State Property Tax',
    short_name: 'MortgageCalc',
    description: 'Instant mortgage payment calculator with real state property-tax rates.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafb',
    theme_color: '#1a5fb4',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
