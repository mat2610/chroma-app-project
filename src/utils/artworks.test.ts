import { describe, expect, it } from 'vitest'
import type { ApiArtwork } from '../types'
import { imageUrl, toArtwork, toArtworks } from './artworks'

// A complete API item; each test copies it and changes only what it checks.
const apiItem: ApiArtwork = {
  id: 27992,
  title: 'A Sunday on La Grande Jatte — 1884',
  artist_title: 'Georges Seurat',
  date_display: '1884–86',
  date_start: 1884,
  medium_display: 'Oil on canvas',
  place_of_origin: 'France',
  image_id: '2d484387-2509-5e8e-2c43-22f9981972eb',
  color: { h: 41, s: 41, l: 54 },
}

describe('toArtwork', () => {
  it('maps every API field to our field name', () => {
    expect(toArtwork(apiItem)).toEqual({
      id: 27992,
      title: 'A Sunday on La Grande Jatte — 1884',
      artist: 'Georges Seurat',
      dateDisplay: '1884–86',
      dateStart: 1884,
      medium: 'Oil on canvas',
      placeOfOrigin: 'France',
      imageId: '2d484387-2509-5e8e-2c43-22f9981972eb',
      color: { h: 41, s: 41, l: 54 },
    })
  })

  it('uses "Unknown artist" when the artist is missing', () => {
    expect(toArtwork({ ...apiItem, artist_title: null }).artist).toBe('Unknown artist')
  })

  it('uses a default for every other missing value', () => {
    const artwork = toArtwork({
      ...apiItem,
      date_display: null,
      date_start: null,
      medium_display: null,
      place_of_origin: null,
      image_id: null,
      color: null,
    })
    expect(artwork.dateDisplay).toBe('')
    expect(artwork.dateStart).toBe(0)
    expect(artwork.medium).toBe('')
    expect(artwork.placeOfOrigin).toBe('')
    expect(artwork.imageId).toBe('')
    expect(artwork.color).toBeNull()
  })
})

describe('toArtworks', () => {
  it('skips the items without an image_id', () => {
    const items = [
      { ...apiItem, id: 1 },
      { ...apiItem, id: 2, image_id: null },
      { ...apiItem, id: 3 },
    ]
    expect(toArtworks(items).map((artwork) => artwork.id)).toEqual([1, 3])
  })

  it('returns an empty list for an empty list', () => {
    expect(toArtworks([])).toEqual([])
  })
})

describe('imageUrl', () => {
  it('builds the IIIF address, 843 pixels wide', () => {
    expect(imageUrl('abc-123')).toBe(
      'https://www.artic.edu/iiif/2/abc-123/full/843,/0/default.jpg',
    )
  })
})
