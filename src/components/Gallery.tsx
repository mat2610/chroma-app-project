import type { Artwork } from '../types'
import ArtworkCard from './ArtworkCard'

type GalleryProps = {
  artworks: Artwork[]
}

function Gallery({ artworks }: GalleryProps) {
  return (
    <div className="gallery">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  )
}

export default Gallery
