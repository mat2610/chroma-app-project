import { useEffect, useState, type CSSProperties } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchArtwork } from '../api'
import ErrorMessage from '../components/ErrorMessage'
import FavoriteButton from '../components/FavoriteButton'
import type { Artwork, Status } from '../types'
import { getArtworkKind, getKindColor, toArtwork } from '../utils/artworks'

type ArtworkPageProps = {
  favorites: Artwork[]
  onToggleFavorite: (artwork: Artwork) => void
}

function ArtworkPage({ favorites, onToggleFavorite }: ArtworkPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
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

  // The tint comes from the kind of the artwork. While the next one loads, we keep the last color,
  // so the background fades from one color to the other (the transition is in CSS).
  const kind = artwork === null ? 'other' : getArtworkKind(artwork.type)
  const kindColor = getKindColor(kind)
  const style = { '--kind-color': kindColor } as CSSProperties

  // The first page opened in the app has the key "default": then there is no page of ours to go back to.
  function goBack() {
    if (location.key === 'default') {
      navigate('/')
    } else {
      navigate(-1)
    }
  }

  let content
  if (status === 'loading') {
    content = <p className="artwork-page-loading">Loading…</p>
  } else if (status === 'error' || artwork === null) {
    content = (
      <ErrorMessage
        message="Could not load this artwork."
        onRetry={() => setAttempt(attempt + 1)}
      />
    )
  } else {
    // Only the details the API gave us; an empty one is not shown.
    const details = [
      ['Date', artwork.date],
      ['Technique', artwork.technique],
      ['Culture', artwork.culture],
      ['Department', artwork.department],
    ].filter(([, value]) => value !== '')

    content = (
      <article className="artwork-page-layout">
        <div className="artwork-page-media">
          <img
            className="artwork-page-image"
            src={artwork.imageUrl}
            alt={artwork.title}
          />
        </div>
        <div className="artwork-page-info">
          <p className="artwork-page-kind">
            <span className="artwork-page-kind-dot" aria-hidden="true" />
            {kind}
            {artwork.date !== '' && ` · ${artwork.date}`}
          </p>
          <h1 className="artwork-page-title">{artwork.title}</h1>
          <p className="artwork-page-artist">
            <em>by</em> {artwork.artist}
          </p>
          <dl className="artwork-page-details">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {artwork.description !== '' && (
            <p className="artwork-page-description">{artwork.description}</p>
          )}
          <div className="artwork-page-actions">
            <FavoriteButton
              isFavorite={favorites.some((favorite) => favorite.id === artwork.id)}
              onToggle={() => onToggleFavorite(artwork)}
            />
            <a
              className="artwork-page-link"
              href={`https://www.clevelandart.org/art/${artwork.accessionNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              View at the museum ↗
            </a>
          </div>
        </div>
      </article>
    )
  }

  return (
    <div className="artwork-page" style={style}>
      <button type="button" className="back-button" onClick={goBack}>
        ← Back
      </button>
      {content}
    </div>
  )
}

export default ArtworkPage
