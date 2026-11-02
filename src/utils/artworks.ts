import type { ApiArtwork, Artwork } from '../types'

// Converts one API item into our Artwork shape, with a default for every missing value.
export function toArtwork(item: ApiArtwork): Artwork {
  return {
    id: item.id,
    title: item.title,
    artist: item.artist_title ?? 'Unknown artist',
    dateDisplay: item.date_display ?? '',
    dateStart: item.date_start ?? 0,
    medium: item.medium_display ?? '',
    placeOfOrigin: item.place_of_origin ?? '',
    imageId: item.image_id ?? '',
    color: item.color,
  }
}

// Converts a list of API items, skipping the ones without an image.
export function toArtworks(items: ApiArtwork[]): Artwork[] {
  return items.filter((item) => item.image_id !== null).map(toArtwork)
}

// Builds the IIIF image address, 843 pixels wide.
export function imageUrl(imageId: string): string {
  return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`
}
