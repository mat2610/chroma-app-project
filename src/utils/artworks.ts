import type { ApiArtwork, Artwork, ArtworkKind } from '../types'

// "Thomas Eakins (American, 1844–1916)" → "Thomas Eakins". No creator → "Unknown artist".
function artistName(item: ApiArtwork): string {
  const description = item.creators[0]?.description
  if (description === undefined) {
    return 'Unknown artist'
  }
  return description.split(' (')[0]
}

// The API description is HTML: <br> becomes a line break, other tags (<em>, <a>…) are removed, their text is kept.
function toPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Converts one API item into our Artwork shape, with a default for every missing value.
export function toArtwork(item: ApiArtwork): Artwork {
  return {
    id: item.id,
    accessionNumber: item.accession_number,
    title: item.title,
    artist: artistName(item),
    date: item.creation_date ?? '',
    dateEarliest: item.creation_date_earliest ?? 0,
    technique: item.technique ?? '',
    culture: item.culture[0] ?? '',
    type: item.type ?? '',
    department: item.department ?? '',
    description: toPlainText(item.description ?? ''),
    imageUrl: item.images?.web?.url ?? '',
  }
}

// Converts a list of API items, skipping the ones without an image.
export function toArtworks(items: ApiArtwork[]): Artwork[] {
  return items.map(toArtwork).filter((artwork) => artwork.imageUrl !== '')
}

// Keeps the artworks whose title or artist contains the query, ignoring upper/lower case.
// An empty query (or only spaces) keeps them all.
export function filterArtworks(artworks: Artwork[], query: string): Artwork[] {
  const search = query.trim().toLowerCase()
  if (search === '') {
    return artworks
  }
  return artworks.filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(search) ||
      artwork.artist.toLowerCase().includes(search),
  )
}

// Every kind, in the order the filter chips show them, with its color from PRD.md.
export const KIND_COLORS: Record<ArtworkKind, string> = {
  painting: '#c9a46a',
  print: '#6f9fd8',
  drawing: '#d98c6a',
  photograph: '#9aa5b1',
  sculpture: '#8fbf8a',
  other: '#a6a29a',
}

// The color of a kind, for the chips and the tinted artwork page.
export function getKindColor(kind: ArtworkKind): string {
  return KIND_COLORS[kind]
}

// The API type ('Painting', 'Print'…) → our kind. Any other type (Ceramic, Textile…) is 'other'.
export function getArtworkKind(type: string): ArtworkKind {
  switch (type.toLowerCase()) {
    case 'painting':
      return 'painting'
    case 'print':
      return 'print'
    case 'drawing':
      return 'drawing'
    case 'photograph':
      return 'photograph'
    case 'sculpture':
      return 'sculpture'
    default:
      return 'other'
  }
}

// Returns a new list with the same items in a random order (Fisher–Yates). The original list does not change.
export function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
