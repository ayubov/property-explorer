import type { Listing, ListingDetail } from '../../shared/types/listing'
import {
  FundaContentType,
  FundaImageSize,
  FundaMediaCategory,
  type FundaDetail,
  type FundaListObject,
  type FundaMedia,
  type FundaMediaItem
} from './types'

export const parsePage = (value: unknown): number => {
  const page = Math.floor(Number(value))

  return Number.isFinite(page) && page > 0 ? page : 1
}

// Funda image URLs are http; rewrite so HTTPS deploys are not blocked.
export const toHttps = (url: string): string | null =>
  url.replace(/^http:\/\//, 'https://') || null

// Funda wraps "listed since" in HTML; Vue would show the tags if we left them.
export const stripHtml = (value: string): string | null =>
  value.replace(/<[^>]+>/g, '').trim() || null

// One photo arrives as several MediaItems; Category is the size.
export const pickPhotoUrl = (items: FundaMediaItem[]): string | null => {
  const preferred =
    items.find((item) => item.Category === FundaImageSize.Large) ||
    items.find((item) => item.Category === FundaImageSize.Medium) ||
    items.find((item) => item.Category === FundaImageSize.Small) ||
    items[0]

  return toHttps(preferred?.Url ?? '')
}

export const mapListing = (item: FundaListObject): Listing | null => {
  if (!item.Id) return null

  return {
    id: item.Id,
    address: item.Adres || null,
    city: item.Woonplaats || null,
    price: item.Koopprijs ?? null,
    // Cards render small, so prefer the medium variant when Funda sends one.
    imageUrl: toHttps(item.FotoMedium || item.FotoLarge || ''),
    rooms: item.AantalKamers ?? null,
    livingArea: item.Woonoppervlakte ?? null,
    listedSince: stripHtml(item.AangebodenSindsTekst ?? '')
  }
}

// fallback is HoofdFoto when Media has no usable listing photos
export const mapPhotos = (
  media: FundaMedia[] | undefined,
  fallback: string | null
): string[] => {
  const photos = (media ?? [])
    .filter(
      (item) =>
        item.Categorie === FundaMediaCategory.Photo &&
        item.ContentType === FundaContentType.Image
    )
    .map((item) => pickPhotoUrl(item.MediaItems ?? []))
    .filter((url): url is string => Boolean(url))

  if (photos.length) return photos

  return fallback ? [fallback] : []
}

export const mapListingDetail = (
  item: FundaDetail,
  id: string
): ListingDetail => {
  const imageUrl = toHttps(item.HoofdFoto ?? '')

  return {
    id: item.InternalId || id,
    address: item.Adres || null,
    city: item.Plaats || null,
    price: item.Koopprijs ?? null,
    imageUrl,
    rooms: item.AantalKamers ?? null,
    livingArea: item.WoonOppervlakte ?? null,
    listedSince: stripHtml(item.AangebodenSindsTekst ?? ''),
    description: item.VolledigeOmschrijving?.trim() || null,
    plotArea: item.PerceelOppervlakte ?? null,
    energyLabel: item.Energielabel?.Label || null,
    agentName: item.Makelaar || null,
    photos: mapPhotos(item.Media, imageUrl),
    lat: item.WGS84_Y ?? null,
    lng: item.WGS84_X ?? null
  }
}
