import { describe, expect, it } from 'vitest'
import type { ApiArtwork, Artwork } from '../types'
import { filterArtworks, getArtworkKind, shuffle, toArtwork, toArtworks } from './artworks'

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

describe('filterArtworks', () => {
  const artworks: Artwork[] = [
    toArtwork({ ...apiItem, id: 1, title: 'The Biglin Brothers Turning the Stake' }),
    toArtwork({
      ...apiItem,
      id: 2,
      title: 'Nathaniel Hurd',
      creators: [{ description: 'John Singleton Copley (American, 1738–1815)' }],
    }),
    toArtwork({ ...apiItem, id: 3, title: 'Water Lilies', creators: [] }),
  ]
  const ids = (list: Artwork[]) => list.map((artwork) => artwork.id)

  it('returns every artwork for an empty query', () => {
    expect(ids(filterArtworks(artworks, ''))).toEqual([1, 2, 3])
  })

  it('returns every artwork for a query of only spaces', () => {
    expect(ids(filterArtworks(artworks, '   '))).toEqual([1, 2, 3])
  })

  it('finds by title', () => {
    expect(ids(filterArtworks(artworks, 'lilies'))).toEqual([3])
  })

  it('finds by artist', () => {
    expect(ids(filterArtworks(artworks, 'copley'))).toEqual([2])
  })

  it('ignores upper and lower case', () => {
    expect(ids(filterArtworks(artworks, 'EAKINS'))).toEqual([1])
  })

  it('finds part of a word, and ignores spaces around the query', () => {
    expect(ids(filterArtworks(artworks, '  hur '))).toEqual([2])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterArtworks(artworks, 'picasso')).toEqual([])
  })
})

describe('getArtworkKind', () => {
  it('maps Painting to painting', () => {
    expect(getArtworkKind('Painting')).toBe('painting')
  })

  it('maps Print to print', () => {
    expect(getArtworkKind('Print')).toBe('print')
  })

  it('maps Drawing to drawing', () => {
    expect(getArtworkKind('Drawing')).toBe('drawing')
  })

  it('maps Photograph to photograph', () => {
    expect(getArtworkKind('Photograph')).toBe('photograph')
  })

  it('maps Sculpture to sculpture', () => {
    expect(getArtworkKind('Sculpture')).toBe('sculpture')
  })

  it('maps any other type, or an empty one, to other', () => {
    expect(getArtworkKind('Ceramic')).toBe('other')
    expect(getArtworkKind('Bound Volume')).toBe('other')
    expect(getArtworkKind('')).toBe('other')
  })
})

describe('shuffle', () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  it('keeps the same items, each one once', () => {
    const result = shuffle(numbers)
    expect(result).toHaveLength(numbers.length)
    expect([...result].sort((a, b) => a - b)).toEqual(numbers)
  })

  it('does not change the original list', () => {
    shuffle(numbers)
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('returns an empty list for an empty list', () => {
    expect(shuffle([])).toEqual([])
  })
})
