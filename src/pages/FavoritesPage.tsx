import { Link } from 'react-router-dom'
import ArtworkCard from '../components/ArtworkCard'
import type { Artwork } from '../types'

type FavoritesPageProps = {
  favorites: Artwork[]
  onRemove: (artwork: Artwork) => void
}

function FavoritesPage({ favorites, onRemove }: FavoritesPageProps) {
  if (favorites.length === 0) {
    return (
      <section className="favorites-empty">
        <h1>Favorites</h1>
        <p>No favorites yet. Open an artwork and click the heart to keep it here.</p>
        <Link to="/">Browse the gallery</Link>
      </section>
    )
  }

  return (
    <section>
      <h1>Favorites</h1>
      <div className="gallery">
        {favorites.map((artwork) => (
          <div key={artwork.id} className="favorite-item">
            <ArtworkCard artwork={artwork} />
            <button type="button" className="remove-button" onClick={() => onRemove(artwork)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FavoritesPage
