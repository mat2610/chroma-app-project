# Architecture — Chroma

## Folders
```
src/
  main.tsx              starts React, wraps App in <BrowserRouter>
  App.tsx               routes + shared state (artworks, status, favorites)
  types.ts              ApiArtwork, Artwork, ArtworkKind, Status, Insights
  api.ts                fetchArtworks(), fetchArtwork(id) — Cleveland Museum of Art API
  utils/
    artworks.ts         pure logic: toArtwork, toArtworks, filterArtworks,
                        getArtworkKind, getKindColor, getInsights, pickRandom
    artworks.test.ts    Vitest tests for the functions above
  components/           NavBar, Gallery, ArtworkCard, SearchBar, KindFilter,
                        Loader, ErrorMessage, FavoriteButton, StatBar
  pages/                GalleryPage, ArtworkPage, FavoritesPage,
                        InsightsPage, NotFoundPage
  data/sample.json      6 artworks used in task 1 (before the API)
```

## Routes
| URL | Page | Data |
|---|---|---|
| `/` | GalleryPage | `artworks` from App (props) |
| `/artworks/:id` | ArtworkPage | its own fetch with `useParams().id` |
| `/favorites` | FavoritesPage | `favorites` from App (props) |
| `/insights` | InsightsPage | `artworks` from App → `getInsights()` |
| `*` | NotFoundPage | — |

## Where the state lives, and why
| State | Where | Why there |
|---|---|---|
| `artworks`, `status` | `App` | Used by 3 pages (gallery, insights, Surprise me): the closest common parent. |
| `favorites` | `App` | Used by NavBar (count), ArtworkPage (heart) and FavoritesPage. Saved in `localStorage`. |
| `query`, `kind` | `GalleryPage` | Only the gallery uses them, so they stay low. |
| `artwork`, `status` of one item | `ArtworkPage` | The page loads its own item, so a direct link like `/artworks/94979` works. |

## Data flow
```
API ──fetchArtworks()──▶ App (useEffect) ──toArtworks()──▶ artworks state
                                   │ props
        ┌──────────────────────────┼─────────────────────────┐
   GalleryPage                InsightsPage             FavoritesPage
   query, kind                getInsights()            favorites
   filterArtworks()           StatBar
   Gallery → ArtworkCard (Link to /artworks/:id)
                                   │ click
                              ArtworkPage ── useParams ── fetchArtwork(id)
                              getKindColor(), FavoriteButton ── toggleFavorite (from App)
```

## What happens when I click an artwork
1. `ArtworkCard` is a `<Link to={`/artworks/${artwork.id}`}>`: the URL changes, no page reload.
2. React Router matches `/artworks/:id` and renders `ArtworkPage`.
3. `ArtworkPage` reads `id` with `useParams()`.
4. Its `useEffect` (dependency `[id]`) sets `status` to `loading` and calls `fetchArtwork(id)`.
5. The answer goes through `toArtwork()` and into the `artwork` state; `status` becomes `ready`.
6. React re-renders: tint from `getKindColor(artwork.kind)`, details, `FavoriteButton` with `toggleFavorite` from App.

## API change (task 5)
The project started on the Art Institute of Chicago API. Since late October 2026 it answers browser requests with 403 and no CORS header. The course rule says not to use a proxy but to switch API, so task 5 moved to the Cleveland Museum of Art Open Access API. The rest of the app did not change: only `api.ts`, the `ApiArtwork` type and `toArtwork` (plus their tests).
