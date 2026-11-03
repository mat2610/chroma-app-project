import { useState } from 'react'
import Gallery from '../components/Gallery'
import SearchBar from '../components/SearchBar'
import type { Artwork } from '../types'
import { filterArtworks } from '../utils/artworks'

type GalleryPageProps = {
  artworks: Artwork[]
}

function GalleryPage({ artworks }: GalleryPageProps) {
  // Only this page searches, so the query lives here and not in App.
  const [query, setQuery] = useState('')
  // Computed on every render from the list and the query; no need for a second state.
  const visibleArtworks = filterArtworks(artworks, query)

  return (
    <section>
      <h1>Gallery</h1>
      <SearchBar value={query} onChange={setQuery} />
      <Gallery artworks={visibleArtworks} />
    </section>
  )
}

export default GalleryPage
