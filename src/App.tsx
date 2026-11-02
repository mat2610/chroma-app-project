import { useEffect, useState } from 'react'
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

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [status, setStatus] = useState<Status>('loading')

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

  let galleryContent
  if (status === 'loading') {
    galleryContent = <Loader />
  } else if (status === 'error') {
    galleryContent = (
      <ErrorMessage
        message="Could not load the artworks."
        onRetry={reload}
      />
    )
  } else {
    galleryContent = <GalleryPage artworks={artworks} />
  }

  return (
    <>
      <NavBar />
      <main className="app">
        <Routes>
          <Route path="/" element={galleryContent} />
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
