export type Listing = {
  id: string
  address: string | null
  city: string | null
  price: number | null
  imageUrl: string | null
  rooms: number | null
  livingArea: number | null
  listedSince: string | null
}

export type ListingPage = {
  listings: Listing[]
  page: number
  pageCount: number
}

export type ListingDetail = Listing & {
  description: string | null
  plotArea: number | null
  energyLabel: string | null
  agentName: string | null
  photos: string[]
  lat: number | null
  lng: number | null
}
