import { Link } from 'react-router-dom'
import type { Artwork } from '../types'

type ArtworkCardProps = {
  artwork: Artwork
}

function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Link to={`/artworks/${artwork.id}`} className="artwork-card">
      <img
        className="artwork-card-image"
        src={artwork.imageUrl}
        alt={artwork.title}
        loading="lazy"
      />
      <h2 className="artwork-card-title">{artwork.title}</h2>
      <p className="artwork-card-artist">{artwork.artist}</p>
      <p className="artwork-card-date">{artwork.date}</p>
    </Link>
  )
}

export default ArtworkCard
