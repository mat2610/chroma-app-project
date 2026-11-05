import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Artwork } from '../types'
import { getArtworkKind, getKindColor } from '../utils/artworks'

type ArtworkCardProps = {
  artwork: Artwork
}

function ArtworkCard({ artwork }: ArtworkCardProps) {
  const kind = getArtworkKind(artwork.type)
  // The line under the image and the kind on the overlay use the color of the kind.
  const style = { '--kind-color': getKindColor(kind) } as CSSProperties

  return (
    <Link to={`/artworks/${artwork.id}`} className="artwork-card" style={style}>
      <div className="artwork-card-media">
        <img
          className="artwork-card-image"
          src={artwork.imageUrl}
          alt={artwork.title}
          loading="lazy"
        />
        {/* Slides in on hover: the date and the kind. */}
        <div className="artwork-card-overlay">
          <span className="artwork-card-date">{artwork.date}</span>
          <span className="artwork-card-kind">{kind}</span>
        </div>
      </div>
      <span className="artwork-card-line" aria-hidden="true" />
      <h2 className="artwork-card-title">{artwork.title}</h2>
      <p className="artwork-card-artist">{artwork.artist}</p>
    </Link>
  )
}

export default ArtworkCard
