import { describe, expect, it } from 'vitest'
import { dedupeById } from './listings'

describe('dedupeById', () => {
  it('keeps the first position when a listing repeats across pages', () => {
    const items = [
      { id: 'a', price: 1 },
      { id: 'b', price: 2 },
      { id: 'a', price: 3 }
    ]

    expect(dedupeById(items)).toEqual([
      { id: 'a', price: 3 },
      { id: 'b', price: 2 }
    ])
  })

  it('leaves a unique list untouched', () => {
    const items = [{ id: 'a' }, { id: 'b' }]

    expect(dedupeById(items)).toEqual(items)
  })
})
