import { Link } from 'react-router-dom'
import type { Artwork } from '../types'
import { imageUrl } from '../utils/artworks'

type ArtworkCardProps = {
  artwork: Artwork
}

function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Link to={`/artworks/${artwork.id}`} className="artwork-card">
      <img
        className="artwork-card-image"
        src={imageUrl(artwork.imageId)}
        alt={artwork.title}
        loading="lazy"
      />
      <h2 className="artwork-card-title">{artwork.title}</h2>
      <p className="artwork-card-artist">{artwork.artist}</p>
      <p className="artwork-card-date">{artwork.dateDisplay}</p>
    </Link>
  )
}

export default ArtworkCard
