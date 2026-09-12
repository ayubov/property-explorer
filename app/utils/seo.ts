import { descriptionParagraphs } from './description'

type ListingPlace = {
  address: string | null
  city: string | null
}

export const listingMetaTitle = (
  listing: ListingPlace | null | undefined
): string =>
  [listing?.address, listing?.city].filter(Boolean).join(', ') || 'Listing'

export const listingMetaDescription = (
  listing: (ListingPlace & { description: string | null }) | null | undefined
): string => {
  const [fromBody] = descriptionParagraphs(listing?.description)
  if (fromBody) return fromBody.slice(0, 160)

  const place = [listing?.address, listing?.city].filter(Boolean).join(', ')

  return place ? `${place} for sale.` : 'Home for sale in the Netherlands.'
}
