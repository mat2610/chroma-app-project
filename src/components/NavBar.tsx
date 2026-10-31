import { NavLink } from 'react-router-dom'

function NavBar() {
  return (
    <nav className="navbar">
      <span className="navbar-logo">Chroma</span>
      <NavLink to="/" end>
        Gallery
      </NavLink>
      <NavLink to="/favorites">Favorites</NavLink>
      <NavLink to="/insights">Insights</NavLink>
    </nav>
  )
}

export default NavBar
