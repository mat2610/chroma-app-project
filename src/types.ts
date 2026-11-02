// One artwork, in the shape our app uses.
export type Artwork = {
  id: number
  accessionNumber: string
  title: string
  artist: string
  date: string
  dateEarliest: number
  technique: string
  culture: string
  type: string
  department: string
  description: string
  imageUrl: string
}

// One creator of an artwork. "description" reads like "Thomas Eakins (American, 1844–1916)".
type ApiCreator = {
  description: string
}

// One size of an artwork image. The API also sends "print" and "full"; we only use "web".
type ApiImage = {
  url: string
}

// One artwork, exactly as the Cleveland Museum of Art API sends it.
export type ApiArtwork = {
  id: number
  accession_number: string
  title: string
  // Empty when the artist is unknown.
  creators: ApiCreator[]
  creation_date: string | null
  creation_date_earliest: number | null
  technique: string | null
  // A list, for example ["France"]. Can be empty.
  culture: string[]
  type: string | null
  department: string | null
  // Only in the single-artwork answer, not in the list.
  description?: string | null
  // null or {} when the artwork has no image.
  images: { web?: ApiImage } | null
}

// The three moments of loading data: waiting, failed, or done.
export type Status = 'loading' | 'error' | 'ready'
