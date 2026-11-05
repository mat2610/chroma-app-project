import { describe, expect, it } from 'vitest'
import type { Artwork } from '../types'
import { centuryLabel, getCentury, getInsights } from './insights'

let nextId = 1

// An artwork with only what the insights look at; the rest is filled in.
function makeArtwork(type: string, artist: string, dateEarliest: number): Artwork {
  const id = nextId++
  return {
    id,
    accessionNumber: `1927.${id}`,
    title: `Artwork ${id}`,
    artist,
    date: String(dateEarliest),
    dateEarliest,
    technique: '',
    culture: '',
    type,
    department: '',
    description: '',
    imageUrl: `https://openaccess-cdn.clevelandart.org/${id}_web.jpg`,
  }
}

describe('getCentury', () => {
  it('gives the century of a year', () => {
    expect(getCentury(1873)).toBe(19)
    expect(getCentury(1800)).toBe(19)
    expect(getCentury(1900)).toBe(20)
    expect(getCentury(5)).toBe(1)
  })

  it('gives a negative century for a BCE year', () => {
    expect(getCentury(-300)).toBe(-4)
    expect(getCentury(-883)).toBe(-9)
  })

  it('gives no century for 0, our "no date"', () => {
    expect(getCentury(0)).toBeNull()
  })
})

describe('centuryLabel', () => {
  it('writes the century with st, nd, rd or th', () => {
    expect(centuryLabel(1)).toBe('1st century')
    expect(centuryLabel(2)).toBe('2nd century')
    expect(centuryLabel(3)).toBe('3rd century')
    expect(centuryLabel(11)).toBe('11th century')
    expect(centuryLabel(19)).toBe('19th century')
    expect(centuryLabel(21)).toBe('21st century')
  })

  it('adds BCE to a negative century', () => {
    expect(centuryLabel(-4)).toBe('4th century BCE')
  })
})

describe('getInsights', () => {
  it('gives zeros and empty lists for no artworks', () => {
    expect(getInsights([])).toEqual({
      total: 0,
      byKind: { painting: 0, print: 0, drawing: 0, photograph: 0, sculpture: 0, other: 0 },
      topArtists: [],
      byCentury: [],
    })
  })

  it('counts the artworks of each kind', () => {
    const insights = getInsights([
      makeArtwork('Painting', 'A', 1873),
      makeArtwork('Painting', 'B', 1873),
      makeArtwork('Print', 'C', 1873),
      makeArtwork('Ceramic', 'D', 1873),
    ])
    expect(insights.total).toBe(4)
    expect(insights.byKind).toEqual({
      painting: 2,
      print: 1,
      drawing: 0,
      photograph: 0,
      sculpture: 0,
      other: 1,
    })
  })

  it('keeps the 5 artists with the most artworks, most first, ties by name', () => {
    const artworks = [
      ...['Redon', 'Redon', 'Redon'].map((artist) => makeArtwork('Print', artist, 1890)),
      ...['Degas', 'Degas'].map((artist) => makeArtwork('Drawing', artist, 1880)),
      ...['Monet', 'Cassatt', 'Bellows', 'Eakins'].map((artist) =>
        makeArtwork('Painting', artist, 1880),
      ),
    ]
    expect(getInsights(artworks).topArtists).toEqual([
      { name: 'Redon', count: 3 },
      { name: 'Degas', count: 2 },
      { name: 'Bellows', count: 1 },
      { name: 'Cassatt', count: 1 },
      { name: 'Eakins', count: 1 },
    ])
  })

  it('leaves "Unknown artist" out of the top artists', () => {
    const artworks = [
      makeArtwork('Sculpture', 'Unknown artist', -300),
      makeArtwork('Sculpture', 'Unknown artist', -300),
      makeArtwork('Painting', 'Monet', 1900),
    ]
    expect(getInsights(artworks).topArtists).toEqual([{ name: 'Monet', count: 1 }])
  })

  it('counts the artworks per century, oldest first, and skips "no date"', () => {
    const artworks = [
      makeArtwork('Painting', 'A', 1873),
      makeArtwork('Painting', 'B', 1801),
      makeArtwork('Sculpture', 'C', -300),
      makeArtwork('Print', 'D', 1510),
      makeArtwork('Print', 'E', 0),
    ]
    expect(getInsights(artworks).byCentury).toEqual([
      { century: -4, count: 1 },
      { century: 16, count: 1 },
      { century: 19, count: 2 },
    ])
  })
})
