import { useEffect, useState, type ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { fetchArtworks } from './api'
import ErrorMessage from './components/ErrorMessage'
import Loader from './components/Loader'
import NavBar from './components/NavBar'
import ArtworkPage from './pages/ArtworkPage'
import FavoritesPage from './pages/FavoritesPage'
import GalleryPage from './pages/GalleryPage'
import InsightsPage from './pages/InsightsPage'
import NotFoundPage from './pages/NotFoundPage'
import type { Artwork, Status } from './types'
import { toArtworks } from './utils/artworks'
import { loadFavorites, saveFavorites, toggleInList } from './utils/favorites'

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [status, setStatus] = useState<Status>('loading')
  // Read from localStorage once, at the first render (a function, so it does not run again on every render).
  const [favorites, setFavorites] = useState<Artwork[]>(loadFavorites)

  // Saved after every change of the list.
  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  // Adds the artwork if it is not a favorite yet, removes it if it is.
  function toggleFavorite(artwork: Artwork) {
    setFavorites((current) => toggleInList(current, artwork))
  }

  function loadArtworks() {
    fetchArtworks()
      .then((items) => {
        setArtworks(toArtworks(items))
        setStatus('ready')
      })
      .catch(() => {
        setStatus('error')
      })
  }

  // "Try again": show the skeletons again, then load.
  function reload() {
    setStatus('loading')
    loadArtworks()
  }

  // Runs once, after the first render. status already starts as 'loading'.
  useEffect(() => {
    loadArtworks()
  }, [])

  // The gallery and the insights both need the list: skeletons while loading, the error with
  // "Try again" if it failed, and the page itself when the list is ready.
  function withArtworks(page: ReactNode) {
    if (status === 'loading') {
      return <Loader />
    }
    if (status === 'error') {
      return <ErrorMessage message="Could not load the artworks." onRetry={reload} />
    }
    return page
  }

  return (
    <>
      <NavBar favoritesCount={favorites.length} />
      <main className="app">
        <Routes>
          <Route path="/" element={withArtworks(<GalleryPage artworks={artworks} />)} />
          <Route
            path="/artworks/:id"
            element={<ArtworkPage favorites={favorites} onToggleFavorite={toggleFavorite} />}
          />
          <Route
            path="/favorites"
            element={<FavoritesPage favorites={favorites} onRemove={toggleFavorite} />}
          />
          <Route
            path="/insights"
            element={withArtworks(<InsightsPage artworks={artworks} />)}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
