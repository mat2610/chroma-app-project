# PRD — Chroma

## What
**Chroma** is a gallery app for the open-access collection of the Cleveland Museum of Art. You browse a grid of artworks, open each one on its own page, keep your favorites, and see statistics about the collection. Its signature: each kind of artwork (painting, print, drawing, photograph, sculpture) has **its own color**, used for the filter chips and to **tint the artwork page**.

## For whom
Anyone curious about art who wants to explore famous works quickly, on desktop or phone, with no account.

## Why
Museum websites are rich but heavy. Chroma shows what matters (image, artist, date, technique, story) and adds a playful way to explore: **by kind of work, each with its color**.

## Data
- API: Cleveland Museum of Art Open Access — `https://openaccess-api.clevelandart.org/api/artworks/` (free, no key, CORS open)
- List: `?has_image=1&limit=20&type={Type}&fields=id,accession_number,title,creators,creation_date,creation_date_earliest,technique,culture,type,department,images&t={Date.now()}`
  - 5 requests, one per kind (`Painting`, `Print`, `Drawing`, `Photograph`, `Sculpture`), 20 artworks each, sent at the same time with `Promise.all`. If one fails, the whole list fails and the app shows "Try again".
  - The 100 results are shuffled once, so the kinds are mixed in the grid.
  - `t` is a cache-busting parameter: the API's cache sometimes serves an answer without the CORS header, and a unique URL always gets a fresh answer.
- One artwork: `https://openaccess-api.clevelandart.org/api/artworks/{id}?t={Date.now()}` (no `fields`, so the answer includes the `description`)
- Images: `images.web.url` in each artwork
- Fields used: `id`, `accession_number`, `title`, `creators[0].description`, `creation_date`, `creation_date_earliest`, `technique`, `culture`, `type`, `department`, `description`, `images.web.url`
- Why not the Art Institute of Chicago API: since late October 2026 it answers browser requests with 403 and no CORS header. Following the course rule (no proxy), we switched API.

## Pages
| URL | Page | What the user does |
|---|---|---|
| `/` | Gallery | Searches, filters by kind of work (chips "All" + the 5 kinds; no "Other" chip, since only the 5 kinds are loaded), clicks an artwork |
| `/artworks/:id` | Artwork | Sees the details and the story, adds to favorites, goes back with "← Back" (to the previous page, or to the gallery when the page was opened directly) |
| `/favorites` | Favorites | Sees and removes saved artworks (saved in localStorage) |
| `/insights` | Insights | Sees stats on the loaded collection: artworks per kind, top artists, artworks per century |
| `*` | Not found | Sees a 404 message and a link back to the gallery |

A navigation bar (`NavLink`) links Gallery, Favorites and Insights, plus a "Surprise me" button that opens a random artwork.

## Acceptance
- When I open the app, I see skeleton cards, then a grid of at least 20 artworks with images.
- When I click an artwork, the URL becomes `/artworks/<id>` and I see its details on a page tinted with the color of its kind.
- When I type in the search box, I see only artworks whose title or artist matches.
- When I click a kind chip (Painting, Print…), I see only artworks of that kind.
- When I add an artwork to favorites and refresh, I still see it on `/favorites`.
- When I open `/insights`, I see bars for each kind, the top 5 artists and the artworks per century.
- When the API cannot be reached, I see an error message and a "Try again" button.

## Design
Dark museum style: background `#0f0f0e`, text `#ece8e0`, muted `#a6a29a`. "Instrument Serif" for titles, "Manrope" for text (Google Fonts). Cards lift on hover. One color per kind: painting `#c9a46a` (gold), print `#6f9fd8` (blue), drawing `#d98c6a` (terracotta), photograph `#9aa5b1` (silver), sculpture `#8fbf8a` (green), other `#a6a29a`. The artwork page background is a dark tint of its kind's color. Skeletons with a shimmer. Hand-written CSS, works at 390px wide.

## Tech
React + Vite + TypeScript (no `any`), React Router, Vitest (+ Vitest UI). No server, no database, no UI library, no Redux.

More: [docs/architecture.md](docs/architecture.md) — components, pages and data flow.
