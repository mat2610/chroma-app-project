import type { Artwork } from '../types'

type ArtworkCardProps = {
  artwork: Artwork
}

function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <article className="artwork-card">
      <h2 className="artwork-card-title">{artwork.title}</h2>
      <p className="artwork-card-artist">{artwork.artist}</p>
      <p className="artwork-card-date">{artwork.dateDisplay}</p>
    </article>
  )
}

export default ArtworkCard
