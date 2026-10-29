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
