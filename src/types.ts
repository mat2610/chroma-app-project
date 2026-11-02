// The dominant color of a painting, in HSL (hue 0–360, saturation and lightness 0–100).
export type ArtworkColor = {
  h: number
  s: number
  l: number
}

// One artwork, in the shape our app uses.
export type Artwork = {
  id: number
  title: string
  artist: string
  dateDisplay: string
  dateStart: number
  medium: string
  placeOfOrigin: string
  imageId: string
  color: ArtworkColor | null
}

// One artwork, exactly as the API sends it. Any field except id and title can be null.
export type ApiArtwork = {
  id: number
  title: string
  artist_title: string | null
  date_display: string | null
  date_start: number | null
  medium_display: string | null
  place_of_origin: string | null
  image_id: string | null
  color: ArtworkColor | null
}

// The three moments of loading data: waiting, failed, or done.
export type Status = 'loading' | 'error' | 'ready'
