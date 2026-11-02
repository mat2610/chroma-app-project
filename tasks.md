# Tasks — Chroma

One task at a time: `npm test`, `npm run build`, check in the browser, commit.
Architecture and data flow: [docs/architecture.md](docs/architecture.md).

## 1. Types and a static list ✅
Create `src/types.ts` (`Artwork`), `src/data/sample.json` with 6 artworks, and the components `Gallery` and `ArtworkCard` with typed props. The list uses `map` with `key={artwork.id}`.
**Done when:** 6 cards with title and artist show, `npm run build` passes.

## 2. Routing and navigation ✅
Install React Router. In `App.tsx`: routes `/` (GalleryPage), `/artworks/:id` (ArtworkPage, reads `id` with `useParams`), `/favorites`, `/insights`, `*` (NotFoundPage). A `NavBar` component with `NavLink`. Clicking a card is a `Link` to `/artworks/<id>`.
**Done when:** clicking a card opens `/artworks/<id>` with its details, and the nav links change the URL and the page.

## 3. Real data from the API ✅
`src/api.ts` with `fetchArtworks()` and `fetchArtwork(id)`. In `App`: `fetch` inside `useEffect` for the list, with a `status` state (`loading` / `error` / `ready`). `ArtworkPage` fetches its own artwork. Conversion in `src/utils/artworks.ts`: `toArtwork`, `toArtworks`. Components `Loader` and `ErrorMessage` with "Try again".
**Done when:** skeletons while loading, the error screen on a broken URL, "Try again" reloads.

## 4. First tests with Vitest ✅
Install Vitest and `@vitest/ui`, scripts `test` and `test:ui`. Tests in `src/utils/artworks.test.ts`.
**Done when:** `npm test` passes and the tests show with `npm run test:ui`.

## 5. Switch to the Cleveland Museum of Art API
The Art Institute of Chicago API now answers browser requests with 403 and no CORS header (seen in the console). Switch `api.ts` to the Cleveland API (URLs in PRD.md), add an `ApiArtwork` type for its shape, update `toArtwork` (artist = `creators[0].description` before " (", image = `images.web.url`, culture = first item) and its tests. Remove the Chicago color field.
**Done when:** 20+ real artworks with images show in Chrome, the artwork page loads by id, `npm test` and `npm run build` pass.

## 6. Search
`SearchBar` component (controlled input). The `query` state lives in `GalleryPage`. Logic in `filterArtworks(artworks, query)`, case-insensitive on title and artist, with tests.
**Done when:** typing an artist's name shows only their works, clearing shows all, tests pass.

## 7. Filter by kind
`ArtworkKind` type (`"painting" | "print" | "drawing" | "photograph" | "sculpture" | "other"`) and `getArtworkKind(type)` in utils, with one test per kind. `KindFilter` chips with a colored dot ("All" first), state `kind` in `GalleryPage`, and the text "X of Y artworks".
**Done when:** each chip shows only its kind, tests pass.

## 8. The tinted artwork page
`getKindColor(kind)` returns the color from PRD.md, with a test. `ArtworkPage` uses it as a dark tinted background and accent, and shows title, artist, date, technique, culture, department and the description. A "View at the museum ↗" link to `https://www.clevelandart.org/art/{accession_number}`.
**Done when:** a painting and a print show two different tints, the description shows.

## 9. Favorites page
`favorites` (array of `Artwork`) lives in `App`, read from `localStorage` at start and saved on every change. `toggleFavorite` passed by props. `FavoriteButton` on the artwork page, the count in `NavBar`, `/favorites` lists them with a remove button.
**Done when:** a favorite is still there after a page refresh, and removing it works.

## 10. Insights page
`getInsights(artworks)` returns the count per kind, the top 5 artists and the count per century (from `creation_date_earliest`), with tests. `InsightsPage` shows them with a `StatBar` component (CSS bars, each kind in its color).
**Done when:** the numbers on the page match the loaded list, tests pass.

## 11. Surprise me, 404 and design
`pickRandom(artworks)` in utils with a test, and a "Surprise me" button in `NavBar` (`useNavigate`). `NotFoundPage` with a link home. Design pass from PRD.md: fonts, hover, shimmer, layout at 390px.
**Done when:** the button opens an artwork, `/blabla` shows the 404, the app looks right at 1440px and 390px.

## 12. Docs and final check
`README.md` (what it does, how to run the app and the tests, which API and why it changed) and `docs/architecture.md` up to date.
**Done when:** `npm run build` and `npm test` pass, no `any` in the code, the README is complete.
