import { useParams } from 'react-router-dom'
import sample from '../data/sample.json'
import type { Artwork } from '../types'

// For now we look in the static list. In task 3 this page will fetch its own artwork.
const artworks: Artwork[] = sample

function ArtworkPage() {
  const { id } = useParams()
  const artwork = artworks.find((item) => item.id === Number(id))

  if (artwork === undefined) {
    return <p>Artwork not found.</p>
  }

  return (
    <article className="artwork-page">
      <h1>{artwork.title}</h1>
      <p className="artwork-page-artist">{artwork.artist}</p>
      <dl className="artwork-page-details">
        <dt>Date</dt>
        <dd>{artwork.dateDisplay}</dd>
        <dt>Medium</dt>
        <dd>{artwork.medium}</dd>
        <dt>Place of origin</dt>
        <dd>{artwork.placeOfOrigin}</dd>
      </dl>
    </article>
  )
}

export default ArtworkPage
