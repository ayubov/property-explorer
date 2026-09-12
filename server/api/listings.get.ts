import { fetchListings } from '../funda/api'
import { parsePage } from '../funda/utils'

export default defineEventHandler(async (event) => {
  const { fundaApiKey } = useRuntimeConfig(event)
  const page = parsePage(getQuery(event).page)

  try {
    return await fetchListings(fundaApiKey, page)
  } catch (error) {
    console.error('[funda] listings request failed', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Could not load listings'
    })
  }
})
