import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import sample from './data/sample.json'
import ArtworkPage from './pages/ArtworkPage'
import FavoritesPage from './pages/FavoritesPage'
import GalleryPage from './pages/GalleryPage'
import InsightsPage from './pages/InsightsPage'
import NotFoundPage from './pages/NotFoundPage'
import type { Artwork } from './types'

// Static data for now. In task 3 this list will come from the API.
const artworks: Artwork[] = sample

function App() {
  return (
    <>
      <NavBar />
      <main className="app">
        <Routes>
          <Route path="/" element={<GalleryPage artworks={artworks} />} />
          <Route path="/artworks/:id" element={<ArtworkPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
