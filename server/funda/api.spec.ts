import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchListing, fetchListings } from './api'

const jsonResponse = (body: unknown, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body)
  })

const requestedUrl = (fetchMock: ReturnType<typeof vi.fn>) =>
  fetchMock.mock.calls[0]?.[0]

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchListings', () => {
  it('requests koop listings for the given page', async () => {
    const fetchMock = vi.fn(() =>
      jsonResponse({
        Objects: [{ Id: 'abc', Adres: 'van Goghstraat 5' }],
        Paging: { HuidigePagina: 2, AantalPaginas: 9 }
      })
    )
    vi.stubGlobal('fetch', fetchMock)

    const page = await fetchListings('test-key', 2)

    expect(requestedUrl(fetchMock)).toBe(
      'https://partnerapi.funda.nl/feeds/Aanbod.svc/json/test-key/?type=koop&page=2&pagesize=15'
    )
    expect(page).toMatchObject({
      page: 2,
      pageCount: 9,
      listings: [{ id: 'abc', address: 'van Goghstraat 5' }]
    })
  })

  it('gives the upstream request an abort signal', async () => {
    let init: RequestInit | undefined
    vi.stubGlobal('fetch', (_url: string, options?: RequestInit) => {
      init = options

      return jsonResponse({})
    })

    await fetchListings('test-key', 1)

    expect(init?.signal).toBeInstanceOf(AbortSignal)
  })

  it('drops objects without an id and defaults paging', async () => {
    vi.stubGlobal('fetch', () =>
      jsonResponse({ Objects: [{ Adres: 'No id' }, { Id: 'keep' }] })
    )

    const page = await fetchListings('test-key', 1)

    expect(page.listings.map((item) => item.id)).toEqual(['keep'])
    expect(page.page).toBe(1)
    expect(page.pageCount).toBe(1)
  })

  it('throws when Funda is down', async () => {
    vi.stubGlobal('fetch', () => jsonResponse({}, 502))

    await expect(fetchListings('test-key', 1)).rejects.toThrow(
      'Funda request failed (502)'
    )
  })
})

describe('fetchListing', () => {
  it('returns null for a missing listing', async () => {
    vi.stubGlobal('fetch', () => jsonResponse({}, 404))

    await expect(fetchListing('test-key', 'missing')).resolves.toBeNull()
  })

  it('returns null when the payload has no listing', async () => {
    vi.stubGlobal('fetch', () => jsonResponse({}))

    await expect(fetchListing('test-key', 'empty')).resolves.toBeNull()
  })

  it('maps a detail payload', async () => {
    const fetchMock = vi.fn(() =>
      jsonResponse({
        InternalId: 'abc',
        Adres: 'van Goghstraat 5',
        Plaats: 'Son en Breugel',
        WGS84_Y: 51.5,
        WGS84_X: 5.4
      })
    )
    vi.stubGlobal('fetch', fetchMock)

    const listing = await fetchListing('test-key', 'abc')

    expect(requestedUrl(fetchMock)).toBe(
      'https://partnerapi.funda.nl/feeds/Aanbod.svc/json/detail/test-key/koop/abc/'
    )
    expect(listing).toMatchObject({
      id: 'abc',
      address: 'van Goghstraat 5',
      city: 'Son en Breugel',
      lat: 51.5,
      lng: 5.4
    })
  })

  it('encodes the id so it cannot rewrite the upstream path', async () => {
    const fetchMock = vi.fn(() => jsonResponse({}, 404))
    vi.stubGlobal('fetch', fetchMock)

    await fetchListing('test-key', 'a b/c')

    expect(requestedUrl(fetchMock)).toContain('/koop/a%20b%2Fc/')
  })
})
