import type { ApiArtwork, Artwork } from '../types'

// "Thomas Eakins (American, 1844–1916)" → "Thomas Eakins". No creator → "Unknown artist".
function artistName(item: ApiArtwork): string {
  const description = item.creators[0]?.description
  if (description === undefined) {
    return 'Unknown artist'
  }
  return description.split(' (')[0]
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
    description: item.description ?? '',
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
