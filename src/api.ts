import type { ApiArtwork } from './types'

const BASE_URL = 'https://api.artic.edu/api/v1/artworks'
const FIELDS =
  'id,title,artist_title,date_display,date_start,medium_display,place_of_origin,image_id,color'

// The API wraps its answer in an object with a "data" key.
type ApiListResponse = {
  data: ApiArtwork[]
}

type ApiItemResponse = {
  data: ApiArtwork
}

export async function fetchArtworks(): Promise<ApiArtwork[]> {
  const response = await fetch(`${BASE_URL}?fields=${FIELDS}&limit=60`)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  const json: ApiListResponse = await response.json()
  return json.data
}

export async function fetchArtwork(id: string): Promise<ApiArtwork> {
  const response = await fetch(`${BASE_URL}/${id}?fields=${FIELDS}`)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  const json: ApiItemResponse = await response.json()
  return json.data
}
