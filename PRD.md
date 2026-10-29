# PRD — Chroma

## What
**Chroma** is a gallery app for the public collection of the Art Institute of Chicago. You browse a grid of artworks, open each one on its own page, keep your favorites, and see statistics about the collection. Its signature: every artwork page is **tinted with the painting's dominant color**.

## For whom
Anyone curious about art who wants to explore famous paintings quickly, on desktop or phone, with no account.

## Why
Museum websites are rich but heavy. Chroma shows what matters (image, artist, date, technique) and adds a playful way to explore: **by color**.

## Data
- API: Art Institute of Chicago — `https://api.artic.edu/api/v1/artworks` (free, no key, CORS open)
- One artwork: `https://api.artic.edu/api/v1/artworks/{id}`
- Images (IIIF): `https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg`
- Fields used: `id`, `title`, `artist_title`, `date_display`, `date_start`, `medium_display`, `place_of_origin`, `image_id`, `color` (`h`, `s`, `l`)

## Pages
| URL | Page | What the user does |
|---|---|---|
| `/` | Gallery | Searches, filters by color, clicks an artwork |
| `/artworks/:id` | Artwork | Sees the details, the 5-shade palette, adds to favorites |
| `/favorites` | Favorites | Sees and removes saved artworks (saved in localStorage) |
| `/insights` | Insights | Sees stats on the loaded collection: artworks per color family, top artists, artworks per century |
| `*` | Not found | Sees a 404 message and a link back to the gallery |

A navigation bar (`NavLink`) links Gallery, Favorites and Insights, plus a "Surprise me" button that opens a random artwork.

## Acceptance
- When I open the app, I see skeleton cards, then a grid of at least 20 artworks with images.
- When I click an artwork, the URL becomes `/artworks/<id>` and I see its details on a page tinted with its dominant color.
- When I type in the search box, I see only artworks whose title or artist matches.
- When I click a color chip, I see only artworks of that color family.
- When I add an artwork to favorites and refresh, I still see it on `/favorites`.
- When I open `/insights`, I see bars for each color family, the top 5 artists and the artworks per century.
- When the API cannot be reached, I see an error message and a "Try again" button.

## Design
Dark museum style: background `#0f0f0e`, text `#ece8e0`, muted `#a6a29a`. "Instrument Serif" for titles, "Manrope" for text (Google Fonts). Cards lift on hover. The artwork page background is `hsl(h, s*0.45%, 11%)` of the painting. Skeletons with a shimmer. Hand-written CSS, works at 390px wide.

## Tech
React + Vite + TypeScript (no `any`), React Router, Vitest (+ Vitest UI). No server, no database, no UI library, no Redux.

More: [docs/architecture.md](docs/architecture.md) — components, pages and data flow.
