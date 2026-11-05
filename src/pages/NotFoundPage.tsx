import { Link } from 'react-router-dom'

// Shown for every URL that matches no route.
function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="eyebrow">Error 404</p>
      <h1 className="display-title">
        Lost in the <em>galleries.</em>
      </h1>
      <p className="not-found-text">This page does not exist, or it has moved to another room.</p>
      <Link to="/" className="pill-button">
        ← Back to the gallery
      </Link>
    </section>
  )
}

export default NotFoundPage
