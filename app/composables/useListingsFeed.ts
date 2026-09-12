import type { Listing, ListingPage } from '#shared/types/listing'
import { dedupeById } from '../utils/listings'

export const useListingsFeed = async () => {
  const { data, error } = await useFetch('/api/listings', {
    query: { page: 1 },
    default: (): ListingPage => ({ listings: [], page: 1, pageCount: 1 })
  })

  const listings = ref<Listing[]>([...data.value.listings])
  const page = ref(data.value.page)
  const pageCount = ref(data.value.pageCount)
  const loadingMore = ref(false)
  const loadMoreFailed = ref(false)

  const hasMore = computed(() => page.value < pageCount.value)

  const loadMore = async () => {
    if (!hasMore.value || loadingMore.value) return

    loadingMore.value = true
    loadMoreFailed.value = false

    try {
      const next = await $fetch('/api/listings', {
        query: { page: page.value + 1 }
      })
      // Funda can shift a listing onto the next page while we are paging.
      listings.value = dedupeById([...listings.value, ...next.listings])
      page.value = next.page
      pageCount.value = next.pageCount
    } catch {
      loadMoreFailed.value = true
    } finally {
      loadingMore.value = false
    }
  }

  return {
    listings,
    error,
    hasMore,
    loadMore,
    loadingMore,
    loadMoreFailed
  }
}
