import { describe, expect, it } from 'vitest'
import type { ApiArtwork } from '../types'
import { toArtwork, toArtworks } from './artworks'

// A complete API item (a real one from the Cleveland API); each test copies it and changes only what it checks.
const apiItem: ApiArtwork = {
  id: 151904,
  accession_number: '1927.1984',
  title: 'The Biglin Brothers Turning the Stake',
  creators: [{ description: 'Thomas Eakins (American, 1844–1916)' }],
  creation_date: '1873',
  creation_date_earliest: 1873,
  technique: 'oil on canvas',
  culture: ['United States'],
  type: 'Painting',
  department: 'American Painting and Sculpture',
  description: 'Eakins painted his friends the Biglin brothers racing.',
  images: {
    web: { url: 'https://openaccess-cdn.clevelandart.org/1927.1984/1927.1984_web.jpg' },
  },
}

describe('toArtwork', () => {
  it('maps every API field to our field name', () => {
    expect(toArtwork(apiItem)).toEqual({
      id: 151904,
      accessionNumber: '1927.1984',
      title: 'The Biglin Brothers Turning the Stake',
      artist: 'Thomas Eakins',
      date: '1873',
      dateEarliest: 1873,
      technique: 'oil on canvas',
      culture: 'United States',
      type: 'Painting',
      department: 'American Painting and Sculpture',
      description: 'Eakins painted his friends the Biglin brothers racing.',
      imageUrl: 'https://openaccess-cdn.clevelandart.org/1927.1984/1927.1984_web.jpg',
    })
  })

  it('keeps only the name before " (" as the artist', () => {
    const item = {
      ...apiItem,
      creators: [{ description: 'Claude Monet (French, 1840–1926)' }, { description: 'Someone Else' }],
    }
    expect(toArtwork(item).artist).toBe('Claude Monet')
  })

  it('keeps the whole description when there is no " ("', () => {
    expect(toArtwork({ ...apiItem, creators: [{ description: 'Anonymous' }] }).artist).toBe(
      'Anonymous',
    )
  })

  it('uses "Unknown artist" when there are no creators', () => {
    expect(toArtwork({ ...apiItem, creators: [] }).artist).toBe('Unknown artist')
  })

  it('keeps only the first culture', () => {
    expect(toArtwork({ ...apiItem, culture: ['France', 'Paris'] }).culture).toBe('France')
  })

  it('uses a default for every other missing value', () => {
    const artwork = toArtwork({
      ...apiItem,
      creation_date: null,
      creation_date_earliest: null,
      technique: null,
      culture: [],
      type: null,
      department: null,
      description: undefined,
      images: null,
    })
    expect(artwork.date).toBe('')
    expect(artwork.dateEarliest).toBe(0)
    expect(artwork.technique).toBe('')
    expect(artwork.culture).toBe('')
    expect(artwork.type).toBe('')
    expect(artwork.department).toBe('')
    expect(artwork.description).toBe('')
    expect(artwork.imageUrl).toBe('')
  })
})

describe('toArtworks', () => {
  it('skips the items without a web image', () => {
    const items = [
      { ...apiItem, id: 1 },
      { ...apiItem, id: 2, images: null },
      { ...apiItem, id: 3, images: {} },
      { ...apiItem, id: 4 },
    ]
    expect(toArtworks(items).map((artwork) => artwork.id)).toEqual([1, 4])
  })

  it('returns an empty list for an empty list', () => {
    expect(toArtworks([])).toEqual([])
  })
})
