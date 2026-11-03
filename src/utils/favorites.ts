import type { Artwork } from '../types'

const STORAGE_KEY = 'chroma-favorites'

// Reads the saved favorites. Nothing saved, or broken data → an empty list.
export function loadFavorites(): Artwork[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function saveFavorites(favorites: Artwork[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

// Returns a new list: the artwork is removed if it is already there, added at the end if not.
export function toggleInList(favorites: Artwork[], artwork: Artwork): Artwork[] {
  if (favorites.some((favorite) => favorite.id === artwork.id)) {
    return favorites.filter((favorite) => favorite.id !== artwork.id)
  }
  return [...favorites, artwork]
}
