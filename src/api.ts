import type { ApiArtwork } from './types'
import { shuffle } from './utils/artworks'

const BASE_URL = 'https://openaccess-api.clevelandart.org/api/artworks'
const FIELDS =
  'id,accession_number,title,creators,creation_date,creation_date_earliest,technique,culture,type,department,images'

// The API wraps its answer in an object with a "data" key.
type ApiListResponse = {
  data: ApiArtwork[]
}

type ApiItemResponse = {
  data: ApiArtwork
}

// One request per kind, so every kind filter chip has artworks.
const TYPES = ['Painting', 'Print', 'Drawing', 'Photograph', 'Sculpture']

// The API's cache sometimes serves an answer without the CORS header, and the browser blocks it.
// A unique "t" parameter makes every URL new, so the answer always comes fresh, with the header.
async function fetchArtworksOfType(type: string): Promise<ApiArtwork[]> {
  const response = await fetch(
    `${BASE_URL}/?has_image=1&limit=20&type=${type}&fields=${FIELDS}&t=${Date.now()}`,
  )
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  const json: ApiListResponse = await response.json()
  return json.data
}

// Sends the 5 requests at the same time and waits for all of them.
// If one fails, the whole list fails, and the app shows "Try again".
export async function fetchArtworks(): Promise<ApiArtwork[]> {
  const lists = await Promise.all(TYPES.map(fetchArtworksOfType))
  // [[20 paintings], [20 prints], …] → one list of 100 artworks, shuffled once so the kinds are mixed.
  return shuffle(lists.flat())
}

// No "fields" here: the full answer also has the description. "t" skips the cache, as above.
export async function fetchArtwork(id: string): Promise<ApiArtwork> {
  const response = await fetch(`${BASE_URL}/${id}?t=${Date.now()}`)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  const json: ApiItemResponse = await response.json()
  return json.data
}
