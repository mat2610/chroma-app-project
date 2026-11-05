import { Link, NavLink, useNavigate } from 'react-router-dom'
import type { Artwork } from '../types'
import { pickRandom } from '../utils/artworks'

type NavBarProps = {
  favoritesCount: number
  // The loaded list, for "Surprise me". Empty while it is loading.
  artworks: Artwork[]
}

function NavBar({ favoritesCount, artworks }: NavBarProps) {
  const navigate = useNavigate()

  // Opens the page of one artwork of the list, chosen at random.
  function surprise() {
    const artwork = pickRandom(artworks)
    if (artwork !== undefined) {
      navigate(`/artworks/${artwork.id}`)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          Chroma<span className="navbar-logo-dot">.</span>
        </Link>
        <div className="navbar-links">
          <NavLink to="/" end>
            Gallery
          </NavLink>
          <NavLink to="/favorites">
            Favorites <span className="navbar-count">{favoritesCount}</span>
          </NavLink>
          <NavLink to="/insights">Insights</NavLink>
        </div>
        <button
          type="button"
          className="surprise-button"
          onClick={surprise}
          disabled={artworks.length === 0}
        >
          Surprise me
        </button>
      </div>
    </nav>
  )
}

export default NavBar
