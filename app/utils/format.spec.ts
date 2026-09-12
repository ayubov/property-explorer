import { describe, expect, it } from 'vitest'
import { formatArea, formatPrice } from './format'

describe('formatPrice', () => {
  it('uses a request label when the price is missing or zero', () => {
    expect(formatPrice(null)).toBe('Price on request')
    expect(formatPrice(0)).toBe('Price on request')
  })

  it('formats euros with the Dutch locale', () => {
    expect(formatPrice(700000).replace(/\s/g, ' ')).toBe('€ 700.000')
  })
})

describe('formatArea', () => {
  it('hides missing and zero areas', () => {
    expect(formatArea(null)).toBe('—')
    expect(formatArea(0)).toBe('—')
  })

  it('keeps the square-metre value as-is', () => {
    expect(formatArea(151)).toBe('151 m²')
  })
})
