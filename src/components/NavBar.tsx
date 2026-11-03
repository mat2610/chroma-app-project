import { NavLink } from 'react-router-dom'

type NavBarProps = {
  favoritesCount: number
}

function NavBar({ favoritesCount }: NavBarProps) {
  return (
    <nav className="navbar">
      <span className="navbar-logo">Chroma</span>
      <NavLink to="/" end>
        Gallery
      </NavLink>
      <NavLink to="/favorites">
        Favorites <span className="navbar-count">{favoritesCount}</span>
      </NavLink>
      <NavLink to="/insights">Insights</NavLink>
    </nav>
  )
}

export default NavBar
