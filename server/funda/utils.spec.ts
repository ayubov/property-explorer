import { describe, expect, it } from 'vitest'
import { FundaContentType, FundaImageSize, FundaMediaCategory } from './types'
import {
  mapListing,
  mapListingDetail,
  mapPhotos,
  parsePage,
  pickPhotoUrl,
  stripHtml,
  toHttps
} from './utils'

describe('parsePage', () => {
  it('defaults invalid values to page 1', () => {
    expect(parsePage(undefined)).toBe(1)
    expect(parsePage('abc')).toBe(1)
    expect(parsePage(0)).toBe(1)
    expect(parsePage(-2)).toBe(1)
  })

  it('keeps a positive page number', () => {
    expect(parsePage('3')).toBe(3)
    expect(parsePage('1.9')).toBe(1)
  })
})

describe('toHttps', () => {
  it('upgrades Funda http image URLs', () => {
    expect(toHttps('http://cloud.funda.nl/photo.jpg')).toBe(
      'https://cloud.funda.nl/photo.jpg'
    )
  })

  it('returns null for an empty string', () => {
    expect(toHttps('')).toBeNull()
  })
})

describe('stripHtml', () => {
  it('removes the tags Funda wraps around listed-since', () => {
    expect(stripHtml('<span>4 maanden</span>')).toBe('4 maanden')
  })
})

describe('pickPhotoUrl', () => {
  it('prefers the large size', () => {
    expect(
      pickPhotoUrl([
        { Category: FundaImageSize.Small, Url: 'http://funda.nl/s.jpg' },
        { Category: FundaImageSize.Large, Url: 'http://funda.nl/l.jpg' }
      ])
    ).toBe('https://funda.nl/l.jpg')
  })
})

describe('mapListing', () => {
  it('drops objects without an id', () => {
    expect(mapListing({ Adres: 'Somewhere' })).toBeNull()
  })

  it('keeps missing address and city as null', () => {
    const listing = mapListing({
      Id: 'abc',
      Adres: '',
      Woonplaats: '',
      FotoLarge: 'http://funda.nl/a.jpg',
      AangebodenSindsTekst: '<b>Vandaag</b>'
    })

    expect(listing).toMatchObject({
      id: 'abc',
      address: null,
      city: null,
      listedSince: 'Vandaag',
      imageUrl: 'https://funda.nl/a.jpg'
    })
  })

  it('prefers the medium photo for cards', () => {
    const listing = mapListing({
      Id: 'abc',
      FotoMedium: 'http://funda.nl/m.jpg',
      FotoLarge: 'http://funda.nl/l.jpg'
    })

    expect(listing?.imageUrl).toBe('https://funda.nl/m.jpg')
  })
})

describe('mapPhotos', () => {
  it('uses HoofdFoto when Media has no listing photos', () => {
    expect(mapPhotos([], 'https://funda.nl/main.jpg')).toEqual([
      'https://funda.nl/main.jpg'
    ])
  })

  it('keeps only photo images', () => {
    expect(
      mapPhotos(
        [
          {
            Categorie: FundaMediaCategory.Photo,
            ContentType: FundaContentType.Image,
            MediaItems: [
              { Category: FundaImageSize.Large, Url: 'http://funda.nl/1.jpg' }
            ]
          },
          {
            Categorie: FundaMediaCategory.FloorPlan,
            ContentType: FundaContentType.Image,
            MediaItems: [{ Url: 'http://funda.nl/plan.jpg' }]
          }
        ],
        null
      )
    ).toEqual(['https://funda.nl/1.jpg'])
  })
})

describe('mapListingDetail', () => {
  it('maps WGS84_Y / WGS84_X to lat / lng', () => {
    const listing = mapListingDetail(
      {
        InternalId: 'abc',
        Adres: 'van Goghstraat 5',
        Plaats: 'Son en Breugel',
        WGS84_Y: 51.5,
        WGS84_X: 5.4
      },
      'fallback-id'
    )

    expect(listing.lat).toBe(51.5)
    expect(listing.lng).toBe(5.4)
    expect(listing.id).toBe('abc')
  })
})
