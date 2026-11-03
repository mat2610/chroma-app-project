import { beforeEach, describe, expect, it } from 'vitest'
import type { Artwork } from '../types'
import { loadFavorites, saveFavorites, toggleInList } from './favorites'

function makeArtwork(id: number): Artwork {
  return {
    id,
    accessionNumber: `1927.${id}`,
    title: `Artwork ${id}`,
    artist: 'Thomas Eakins',
    date: '1873',
    dateEarliest: 1873,
    technique: 'oil on canvas',
    culture: 'United States',
    type: 'Painting',
    department: 'American Painting and Sculpture',
    description: '',
    imageUrl: `https://openaccess-cdn.clevelandart.org/${id}_web.jpg`,
  }
}

describe('toggleInList', () => {
  it('adds an artwork that is not in the list, at the end', () => {
    const result = toggleInList([makeArtwork(1)], makeArtwork(2))
    expect(result.map((artwork) => artwork.id)).toEqual([1, 2])
  })

  it('removes an artwork that is already in the list', () => {
    const result = toggleInList([makeArtwork(1), makeArtwork(2)], makeArtwork(1))
    expect(result.map((artwork) => artwork.id)).toEqual([2])
  })

  it('does not change the original list', () => {
    const favorites = [makeArtwork(1)]
    toggleInList(favorites, makeArtwork(2))
    expect(favorites).toHaveLength(1)
  })
})

// Vitest runs in Node, which has no real localStorage: a small one in memory stands in for it.
describe('loadFavorites and saveFavorites', () => {
  beforeEach(() => {
    const store = new Map<string, string>()
    globalThis.localStorage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value)
      },
      removeItem: (key: string) => {
        store.delete(key)
      },
      clear: () => store.clear(),
      key: () => null,
      length: 0,
    }
  })

  it('gives an empty list when nothing is saved', () => {
    expect(loadFavorites()).toEqual([])
  })

  it('reads back what was saved', () => {
    saveFavorites([makeArtwork(1), makeArtwork(2)])
    expect(loadFavorites()).toEqual([makeArtwork(1), makeArtwork(2)])
  })

  it('gives an empty list when the saved data is broken', () => {
    localStorage.setItem('chroma-favorites', '{not json')
    expect(loadFavorites()).toEqual([])
  })

  it('gives an empty list when the saved data is not a list', () => {
    localStorage.setItem('chroma-favorites', '{"id": 1}')
    expect(loadFavorites()).toEqual([])
  })
})
