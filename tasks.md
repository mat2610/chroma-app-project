# Tasks — Chroma

One task at a time: `npm test`, `npm run build`, check in the browser, commit.
Architecture and data flow: [docs/architecture.md](docs/architecture.md).

## 1. Types and a static list
Create `src/types.ts` (`Artwork`, `ArtworkColor`), `src/data/sample.json` with 6 artworks, and the components `Gallery` and `ArtworkCard` with typed props. The list uses `map` with `key={artwork.id}`.
**Done when:** 6 cards with title and artist show, `npm run build` passes.

## 2. Routing and navigation
Install React Router. In `App.tsx`: routes `/` (GalleryPage), `/artworks/:id` (ArtworkPage, reads `id` with `useParams`), `/favorites`, `/insights` (placeholders for now), `*` (NotFoundPage). A `NavBar` component with `NavLink`. Clicking a card is a `Link` to `/artworks/<id>`.
**Done when:** clicking a card opens `/artworks/<id>` with its details, and the nav links change the URL and the page.

## 3. Real data from the API
`src/api.ts` with `fetchArtworks()` and `fetchArtwork(id)`. In `App`: `fetch` inside `useEffect` for the list, with a `status` state (`loading` / `error` / `ready`). `ArtworkPage` fetches its own artwork by id, so a direct link works. Data conversion in `src/utils/artworks.ts`: `toArtwork`, `toArtworks` (skips artworks without `image_id`) and `imageUrl`. Components `Loader` (skeleton cards) and `ErrorMessage` with "Try again".
**Done when:** 20+ real artworks with images, skeletons while loading, the error screen on a broken URL, "Try again" reloads.

## 4. First tests with Vitest
Install Vitest and `@vitest/ui`, add the scripts `test` and `test:ui`. In `src/utils/artworks.test.ts`, test `toArtwork` (fields mapped, missing artist → "Unknown artist"), `toArtworks` (no `image_id` → skipped) and `imageUrl`.
**Done when:** `npm test` passes and the tests show in the browser with `npm run test:ui`.

## 5. Search
`SearchBar` component (controlled input). The `query` state lives in `GalleryPage`, the only page that uses it. Logic in `filterArtworks(artworks, query)`, case-insensitive on title and artist, with tests.
**Done when:** typing "sargent" shows only Sargent's works, clearing shows all, tests pass.

## 6. Color filter
`getColorFamily(color)` returns `"gold" | "red" | "blue" | "muted"` (s < 20 or `null` → muted; h 170–260 → blue; h < 20 or ≥ 330 → red; else gold), with tests. `ColorFilter` chips on the gallery (state `colorFamily` in `GalleryPage`), and the text "X of Y artworks".
**Done when:** each chip shows only its color family, tests pass.

## 7. The tinted artwork page
`ArtworkPage` takes the painting's color as background (`hsl(h, s*0.45%, 11%)`). `getPalette(color)` returns 5 shades (lightness −18, −8, 0, +12, +24, kept between 8 and 90), shown by a `Palette` component, with a test. A "View at the museum ↗" link.
**Done when:** two different artworks show two different backgrounds and palettes.

## 8. Favorites page
`favorites` (array of `Artwork`) lives in `App`, read from `localStorage` at start and saved on every change. `toggleFavorite` is passed down by props. `FavoriteButton` (heart) on the artwork page, the count in `NavBar`, and `/favorites` lists them with a remove button.
**Done when:** a favorite is still there after a page refresh, and removing it works.

## 9. Insights page
`getInsights(artworks)` returns the count per color family, the top 5 artists and the count per century, with tests. `InsightsPage` shows them with a `StatBar` component (CSS bars).
**Done when:** the numbers on the page match the loaded list, tests pass.

## 10. Surprise me + 404
A "Surprise me" button in `NavBar` opens a random artwork from the list (`pickRandom` in utils, with a test, and `useNavigate`). `NotFoundPage` has a link back home.
**Done when:** the button opens an artwork each time, and `/blabla` shows the 404 page.

## 11. Design and narrow screens
Final CSS pass: fonts, hover, shimmer, color transition, layout at 390px.
**Done when:** the app looks right at 1440px and 390px, with no horizontal scroll and no console errors.

## 12. Docs and final check
`README.md` (what it does, how to run the app and the tests, which API) and update `docs/architecture.md` if anything changed.
**Done when:** `npm run build` and `npm test` pass, no `any` in the code, the README is complete.
