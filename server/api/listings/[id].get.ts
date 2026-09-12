import { fetchListing } from '../../funda/api'

export default defineEventHandler(async (event) => {
  const { fundaApiKey } = useRuntimeConfig(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing listing id' })
  }

  try {
    const listing = await fetchListing(fundaApiKey, id)
    if (!listing) {
      throw createError({ statusCode: 404, statusMessage: 'Listing not found' })
    }

    return listing
  } catch (error) {
    if (isError(error)) throw error

    console.error('[funda] listing request failed', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Could not load listing'
    })
  }
})
