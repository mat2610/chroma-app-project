import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchArtwork } from '../api'
import ErrorMessage from '../components/ErrorMessage'
import type { Artwork, Status } from '../types'
import { toArtwork } from '../utils/artworks'

function ArtworkPage() {
  const { id } = useParams()
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  // Changing this number runs the effect again ("Try again").
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (id === undefined) {
      return
    }
    // If the id changes before the answer arrives, we ignore the old answer.
    let ignore = false
    setStatus('loading')
    fetchArtwork(id)
      .then((item) => {
        if (!ignore) {
          setArtwork(toArtwork(item))
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!ignore) {
          setStatus('error')
        }
      })
    return () => {
      ignore = true
    }
  }, [id, attempt])

  if (status === 'loading') {
    return <p>Loading…</p>
  }

  if (status === 'error' || artwork === null) {
    return (
      <ErrorMessage
        message="Could not load this artwork."
        onRetry={() => setAttempt(attempt + 1)}
      />
    )
  }

  return (
    <article className="artwork-page">
      <img
        className="artwork-page-image"
        src={artwork.imageUrl}
        alt={artwork.title}
      />
      <h1>{artwork.title}</h1>
      <p className="artwork-page-artist">{artwork.artist}</p>
      <dl className="artwork-page-details">
        <dt>Date</dt>
        <dd>{artwork.date}</dd>
        <dt>Technique</dt>
        <dd>{artwork.technique}</dd>
        <dt>Culture</dt>
        <dd>{artwork.culture}</dd>
      </dl>
    </article>
  )
}

export default ArtworkPage
