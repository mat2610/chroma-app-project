# Architecture — Chroma

## Folders
```
src/
  main.tsx              starts React, wraps App in <BrowserRouter>
  App.tsx               routes + shared state (artworks, status, favorites)
  types.ts              ApiArtwork, Artwork, ArtworkKind, Status, Insights
  api.ts                fetchArtworks(), fetchArtwork(id) — Cleveland Museum of Art API
  index.css             all the styles (hand-written, no UI library)
  utils/                pure logic, each file with its Vitest tests (*.test.ts)
    artworks.ts         toArtwork, toArtworks, filterArtworks, getArtworkKind,
                        KIND_COLORS, getKindColor, shuffle, pickRandom
    favorites.ts        loadFavorites, saveFavorites (localStorage), toggleInList
    insights.ts         getInsights, getCentury, centuryLabel
  components/           NavBar, Gallery, ArtworkCard, SearchBar, KindFilter,
                        Loader, ErrorMessage, FavoriteButton, StatBar
  pages/                GalleryPage, ArtworkPage, FavoritesPage,
                        InsightsPage, NotFoundPage
  data/sample.json      6 artworks used in task 1 (before the API), no longer imported
```

## Routes
| URL | Page | Data |
|---|---|---|
| `/` | GalleryPage | `artworks` from App (props) |
| `/artworks/:id` | ArtworkPage | its own fetch with `useParams().id` |
| `/favorites` | FavoritesPage | `favorites` from App (props) |
| `/insights` | InsightsPage | `artworks` from App → `getInsights()` |
| `*` | NotFoundPage | — |

The gallery and insights pages are wrapped by `withArtworks()` in App: `Loader` (skeletons) while loading, `ErrorMessage` with "Try again" on error, the page when ready.

## Where the state lives, and why
| State | Where | Why there |
|---|---|---|
| `artworks`, `status` | `App` | Used by 3 places (gallery, insights, Surprise me in NavBar): the closest common parent. |
| `favorites` | `App` | Used by NavBar (count), ArtworkPage (heart) and FavoritesPage. Read from `localStorage` at start, saved on every change. |
| `query`, `kind` | `GalleryPage` | Only the gallery uses them, so they stay low. |
| `artwork`, `status`, `attempt` of one item | `ArtworkPage` | The page loads its own item, so a direct link like `/artworks/94979` works. `attempt` changes on "Try again" to run the fetch again. |

## Loading the list (`fetchArtworks`)
1. `App`'s `useEffect` (empty dependencies, runs once) calls `fetchArtworks()`.
2. `fetchArtworks()` sends **5 requests at the same time** with `Promise.all`, one per type: `Painting`, `Print`, `Drawing`, `Photograph`, `Sculpture`, each `limit=20`. If one fails, the whole promise fails and App shows the error with "Try again".
3. Every URL ends with `t=${Date.now()}`, a **cache-busting parameter**. The API's cache sometimes serves an answer without the CORS header, which the browser blocks; a new URL always gets a fresh answer, with the header. `fetchArtwork(id)` does the same.
4. The 5 lists are flattened into one list of 100 and **shuffled once** (`shuffle`, Fisher–Yates), so the kinds are mixed in the grid.
5. `toArtworks()` converts them to our `Artwork` shape and drops the ones without an image.

## Data flow
```
API ──fetchArtworks()──▶ App (useEffect) ──toArtworks()──▶ artworks state
   5 × Promise.all, shuffle          │ props
        ┌──────────────┬─────────────┼─────────────────────────┐
     NavBar       GalleryPage    InsightsPage            FavoritesPage
  pickRandom()    query, kind    getInsights()           favorites
  "Surprise me"   KindFilter     StatBar
                  filterArtworks()
                  Gallery → ArtworkCard (Link to /artworks/:id)
                                     │ click
                                ArtworkPage ── useParams ── fetchArtwork(id)
                                getArtworkKind() → getKindColor(), FavoriteButton ── toggleFavorite (from App)
```

## Kind filter
`KindFilter` shows "All" then one chip per kind of `KIND_COLORS`, **except "other"**: we only load the 5 main kinds, so an "Other" chip would always be empty. `getArtworkKind()` still returns `'other'` for any other type (for example a Ceramic opened by a direct link like `/artworks/<id>`), and `getKindColor('other')` gives it the muted grey.

## What happens when I click an artwork
1. `ArtworkCard` is a `<Link to={`/artworks/${artwork.id}`}>`: the URL changes, no page reload.
2. React Router matches `/artworks/:id` and renders `ArtworkPage`.
3. `ArtworkPage` reads `id` with `useParams()`.
4. Its `useEffect` (dependencies `[id, attempt]`) sets `status` to `loading` and calls `fetchArtwork(id)`. If `id` changes before the answer arrives, the old answer is ignored.
5. The answer goes through `toArtwork()` and into the `artwork` state; `status` becomes `ready`.
6. React re-renders: the tint is `getKindColor(getArtworkKind(artwork.type))`, set as the CSS variable `--kind-color`, then the details, the description and `FavoriteButton` with `toggleFavorite` from App.

## The back button
"← Back" on the artwork page calls `navigate(-1)`, so it returns to where you were (the gallery, the favorites, insights). When the artwork page is the first page opened in the app (a direct link, `location.key === 'default'`), there is no page of ours to go back to, so it goes to `/` instead.

## Surprise me
The NavBar gets `artworks` from App. The button calls `pickRandom(artworks)` and `navigate('/artworks/<id>')`. It is disabled while the list is empty (loading or error).

## API change (task 5)
The project started on the Art Institute of Chicago API. Since late October 2026 it answers browser requests with 403 and no CORS header. The course rule says not to use a proxy but to switch API, so task 5 moved to the Cleveland Museum of Art Open Access API. The rest of the app did not change: only `api.ts`, the `ApiArtwork` type and `toArtwork` (plus their tests).
