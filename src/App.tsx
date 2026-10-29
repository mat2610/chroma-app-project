import Gallery from './components/Gallery'
import sample from './data/sample.json'
import type { Artwork } from './types'

// Task 1: static data. In task 3 this list will come from the API.
const artworks: Artwork[] = sample

function App() {
  return (
    <main className="app">
      <h1>Chroma</h1>
      <Gallery artworks={artworks} />
    </main>
  )
}

export default App
