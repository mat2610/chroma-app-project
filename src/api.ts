import type { ApiArtwork } from './types'

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

// The API's cache sometimes serves an answer without the CORS header, and the browser blocks it.
// A unique "t" parameter makes every URL new, so the answer always comes fresh, with the header.
export async function fetchArtworks(): Promise<ApiArtwork[]> {
  const response = await fetch(`${BASE_URL}/?has_image=1&limit=60&fields=${FIELDS}&t=${Date.now()}`)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  const json: ApiListResponse = await response.json()
  return json.data
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
