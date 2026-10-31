import Gallery from '../components/Gallery'
import type { Artwork } from '../types'

type GalleryPageProps = {
  artworks: Artwork[]
}

function GalleryPage({ artworks }: GalleryPageProps) {
  return (
    <section>
      <h1>Gallery</h1>
      <Gallery artworks={artworks} />
    </section>
  )
}

export default GalleryPage
