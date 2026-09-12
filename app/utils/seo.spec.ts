import { describe, expect, it } from 'vitest'
import { listingMetaDescription, listingMetaTitle } from './seo'

describe('listingMetaTitle', () => {
  it('joins address and city', () => {
    expect(
      listingMetaTitle({ address: 'van Goghstraat 5', city: 'Son en Breugel' })
    ).toBe('van Goghstraat 5, Son en Breugel')
  })

  it('falls back when both are missing', () => {
    expect(listingMetaTitle({ address: null, city: null })).toBe('Listing')
    expect(listingMetaTitle(null)).toBe('Listing')
  })
})

describe('listingMetaDescription', () => {
  it('uses the first description paragraph', () => {
    expect(
      listingMetaDescription({
        description: 'Quiet street.\n\nMore details later.',
        address: 'van Goghstraat 5',
        city: 'Son en Breugel'
      })
    ).toBe('Quiet street.')
  })

  it('builds a line from the address when there is no description', () => {
    expect(
      listingMetaDescription({
        description: null,
        address: 'van Goghstraat 5',
        city: 'Son en Breugel'
      })
    ).toBe('van Goghstraat 5, Son en Breugel for sale.')
  })
})
