import type { Artwork, ArtworkKind, Insights } from '../types'
import { getArtworkKind } from './artworks'

// The everyday rule: 1873 and 1800 → 19, 1900 → 20. BCE years (negative) mirror it: -300 → -4.
// 0 means "no date" in our Artwork, so it has no century.
export function getCentury(year: number): number | null {
  if (year === 0) {
    return null
  }
  const century = Math.floor(Math.abs(year) / 100) + 1
  return year > 0 ? century : -century
}

// 19 → "19th century", 1 → "1st century", -4 → "4th century BCE".
export function centuryLabel(century: number): string {
  const n = Math.abs(century)
  const lastTwo = n % 100
  const last = n % 10
  let suffix = 'th'
  if (lastTwo < 11 || lastTwo > 13) {
    if (last === 1) suffix = 'st'
    if (last === 2) suffix = 'nd'
    if (last === 3) suffix = 'rd'
  }
  return `${n}${suffix} century${century < 0 ? ' BCE' : ''}`
}

export function getInsights(artworks: Artwork[]): Insights {
  const byKind: Record<ArtworkKind, number> = {
    painting: 0,
    print: 0,
    drawing: 0,
    photograph: 0,
    sculpture: 0,
    other: 0,
  }
  const artistCounts = new Map<string, number>()
  const centuryCounts = new Map<number, number>()

  for (const artwork of artworks) {
    byKind[getArtworkKind(artwork.type)] += 1

    if (artwork.artist !== 'Unknown artist') {
      artistCounts.set(artwork.artist, (artistCounts.get(artwork.artist) ?? 0) + 1)
    }

    const century = getCentury(artwork.dateEarliest)
    if (century !== null) {
      centuryCounts.set(century, (centuryCounts.get(century) ?? 0) + 1)
    }
  }

  // Most artworks first; on a tie, by name, so the order is always the same.
  const topArtists = [...artistCounts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 5)

  const byCentury = [...centuryCounts]
    .map(([century, count]) => ({ century, count }))
    .sort((a, b) => a.century - b.century)

  return { total: artworks.length, byKind, topArtists, byCentury }
}
