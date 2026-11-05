import StatBar from '../components/StatBar'
import type { Artwork, ArtworkKind } from '../types'
import { KIND_COLORS, getKindColor } from '../utils/artworks'
import { centuryLabel, getInsights } from '../utils/insights'

type InsightsPageProps = {
  artworks: Artwork[]
}

const KINDS = Object.keys(KIND_COLORS) as ArtworkKind[]

// 'painting' → 'Painting'
function kindLabel(kind: ArtworkKind): string {
  return kind.charAt(0).toUpperCase() + kind.slice(1)
}

function InsightsPage({ artworks }: InsightsPageProps) {
  // Computed from the loaded list on every render, so the numbers always match the gallery.
  const insights = getInsights(artworks)
  // A kind with no artworks (usually "other") gets no bar.
  const kinds = KINDS.filter((kind) => insights.byKind[kind] > 0)
  const maxKind = Math.max(0, ...kinds.map((kind) => insights.byKind[kind]))
  const maxArtist = Math.max(0, ...insights.topArtists.map((artist) => artist.count))
  const maxCentury = Math.max(0, ...insights.byCentury.map((entry) => entry.count))

  return (
    <section className="insights">
      <header className="insights-header">
        <div>
          <p className="eyebrow">Insights</p>
          <h1 className="display-title">
            The collection, <em>in numbers.</em>
          </h1>
        </div>
        <p className="insights-total">
          <span className="big-number">{insights.total}</span>
          <span>artworks loaded</span>
        </p>
      </header>

      <div className="insights-grid">
        <div className="insights-card">
          <h2>Artworks per kind</h2>
          {kinds.map((kind) => (
            <StatBar
              key={kind}
              label={kindLabel(kind)}
              value={insights.byKind[kind]}
              max={maxKind}
              color={getKindColor(kind)}
            />
          ))}
        </div>

        <div className="insights-card">
          <h2>Top 5 artists</h2>
          {insights.topArtists.map((artist) => (
            <StatBar key={artist.name} label={artist.name} value={artist.count} max={maxArtist} />
          ))}
        </div>

        <div className="insights-card insights-card-wide">
          <h2>Artworks per century</h2>
          {insights.byCentury.map((entry) => (
            <StatBar
              key={entry.century}
              label={centuryLabel(entry.century)}
              value={entry.count}
              max={maxCentury}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default InsightsPage
