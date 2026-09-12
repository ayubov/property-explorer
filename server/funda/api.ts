import type {
  Listing,
  ListingDetail,
  ListingPage
} from '../../shared/types/listing'
import type { FundaDetail, FundaListResponse } from './types'
import { mapListing, mapListingDetail } from './utils'

const FUNDA_BASE = 'https://partnerapi.funda.nl/feeds/Aanbod.svc/json'
const PAGE_SIZE = 15
const TIMEOUT_MS = 8000

const request = async (url: string): Promise<Response> =>
  fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })

export async function fetchListings(
  apiKey: string,
  page: number
): Promise<ListingPage> {
  const response = await request(
    `${FUNDA_BASE}/${apiKey}/?type=koop&page=${page}&pagesize=${PAGE_SIZE}`
  )
  if (!response.ok) {
    throw new Error(`Funda request failed (${response.status})`)
  }

  const payload: FundaListResponse = await response.json()

  return {
    listings: (payload.Objects ?? [])
      .map(mapListing)
      .filter((item): item is Listing => item !== null),
    page: payload.Paging?.HuidigePagina ?? page,
    pageCount: payload.Paging?.AantalPaginas ?? 1
  }
}

export async function fetchListing(
  apiKey: string,
  id: string
): Promise<ListingDetail | null> {
  const response = await request(
    `${FUNDA_BASE}/detail/${apiKey}/koop/${encodeURIComponent(id)}/`
  )
  if (response.status === 404 || response.status === 400) return null
  if (!response.ok) {
    throw new Error(`Funda request failed (${response.status})`)
  }

  const item: FundaDetail = await response.json()
  if (!item.InternalId && !item.Adres) return null

  return mapListingDetail(item, id)
}
