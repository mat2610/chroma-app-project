import { useState } from 'react'
import Gallery from '../components/Gallery'
import KindFilter, { type KindChoice } from '../components/KindFilter'
import SearchBar from '../components/SearchBar'
import type { Artwork } from '../types'
import { filterArtworks, getArtworkKind } from '../utils/artworks'

type GalleryPageProps = {
  artworks: Artwork[]
}

function GalleryPage({ artworks }: GalleryPageProps) {
  // Only this page searches and filters, so both states live here and not in App.
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<KindChoice>('all')

  // Computed on every render: first the kind, then the search on what is left.
  const ofKind =
    kind === 'all' ? artworks : artworks.filter((artwork) => getArtworkKind(artwork.type) === kind)
  const visibleArtworks = filterArtworks(ofKind, query)

  return (
    <section>
      <header className="hero">
        <div className="hero-text">
          <p className="eyebrow">The Cleveland Museum of Art · open access</p>
          <h1 className="hero-title">
            Art, sorted
            <br />
            <em>by its nature.</em>
          </h1>
          <p className="hero-tagline">
            Paintings, prints, drawings, photographs and sculpture, each kind in its own color.
          </p>
        </div>
        <p className="hero-count">
          <span className="hero-count-number">{artworks.length}</span>
          <span className="hero-count-label">artworks</span>
        </p>
      </header>
      <div className="gallery-controls">
        <SearchBar value={query} onChange={setQuery} />
        <KindFilter value={kind} onChange={setKind} />
      </div>
      <p className="gallery-count">
        {visibleArtworks.length} of {artworks.length} artworks
      </p>
      <Gallery artworks={visibleArtworks} />
    </section>
  )
}

export default GalleryPage
