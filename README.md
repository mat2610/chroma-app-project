# Chroma

**Chroma** is a gallery app for the open-access collection of the Cleveland Museum of Art. You browse a grid of artworks, open each one on its own page, keep your favorites and see statistics about the collection.

Its signature is color: each kind of work has **its own color**. The colors are painting gold, print blue, drawing terracotta, photograph silver and sculpture green. Chroma uses them for the filter chips, the cards and the tint of the artwork page.

Built with React, Vite and TypeScript, with React Router and Vitest. There is no server, no database and no UI library. All the CSS is written by hand.

## Pages

| URL | Page | What you can do |
|---|---|---|
| `/` | Gallery | Search by title or artist, filter by kind of work, open an artwork |
| `/artworks/:id` | Artwork | See the image, the details and the story on a page tinted with the kind's color, add it to favorites, go back, open it on the museum site |
| `/favorites` | Favorites | See and remove your saved artworks (kept in `localStorage`, so they survive a refresh) |
| `/insights` | Insights | See bars for the artworks per kind, the top 5 artists and the artworks per century |
| `*` | Not found | A 404 message with a link back to the gallery |

The navigation bar links Gallery, Favorites (with the count) and Insights. Its **Surprise me** button opens a random artwork.

## Run the app

You need [Node.js](https://nodejs.org/) 20 or later.

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

Other scripts:

```bash
npm run build     # type-check with tsc, then build into dist/
npm run preview   # serve the built app from dist/
npm run lint      # oxlint
```

## Run the tests

The tests use [Vitest](https://vitest.dev/). They cover the pure logic in `src/utils/`: converting API data, search, kinds and colors, shuffle, `pickRandom`, favorites and insights.

```bash
npm test          # run all the tests once in the terminal
npm run test:ui   # open the Vitest UI in the browser
```

## The API

Chroma uses the **[Cleveland Museum of Art Open Access API](https://openaccess-api.clevelandart.org/)**. It is free, needs no key and allows requests from the browser (CORS).

- List: `https://openaccess-api.clevelandart.org/api/artworks/?has_image=1&limit=20&type=<Type>&fields=…`
- One artwork: `https://openaccess-api.clevelandart.org/api/artworks/<id>`

To fill the gallery, the app sends **5 requests at the same time** with `Promise.all`, one per kind (Painting, Print, Drawing, Photograph, Sculpture). Each request asks for 20 artworks, so every filter chip has works. The 100 results are then **shuffled once** so the kinds are mixed in the grid.

Every request also adds a parameter `t=<Date.now()>`. The API's cache sometimes serves an answer without the CORS header, and the browser blocks it. A unique URL always gets a fresh answer, with the header.

### Why we switched from the Art Institute of Chicago API

The project started on the Art Institute of Chicago API. Since late October 2026 it answers browser requests with **403 and no CORS header**, so the browser blocks every answer. The course rule is to switch API rather than add a proxy, so task 5 moved Chroma to the Cleveland Museum of Art. Only `api.ts`, the `ApiArtwork` type and `toArtwork` (and their tests) changed. The rest of the app stayed the same.

## Project docs

- [PRD.md](PRD.md): what we build and for whom
- [docs/architecture.md](docs/architecture.md): components, pages, state and data flow
- [tasks.md](tasks.md): the tasks, one at a time
