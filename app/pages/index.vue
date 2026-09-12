<script setup lang="ts">
// Keep this page alive so Load more cards (and Back scroll) survive opening a listing.
definePageMeta({
  keepalive: true
})

useSeoMeta({
  title: 'Homes for sale',
  description:
    'Browse homes for sale in the Netherlands from the Funda partner API.'
})

const { listings, error, hasMore, loadMore, loadingMore, loadMoreFailed } =
  await useListingsFeed()
</script>

<template>
  <section>
    <h1 class="page-title">Homes for sale</h1>
    <p class="page-intro">Listings from the Funda partner API.</p>

    <div role="status" aria-live="polite">
      <p v-if="error" class="status status-error">
        Could not load listings. Try again later.
      </p>
      <p v-else-if="!listings.length" class="status">No listings found.</p>
    </div>

    <template v-if="!error && listings.length">
      <div class="listing-grid">
        <ListingCard
          v-for="listing in listings"
          :key="listing.id"
          :listing="listing"
        />
      </div>
      <div v-if="hasMore" class="load-more">
        <button
          type="button"
          class="load-more-button"
          :disabled="loadingMore"
          @click="loadMore"
        >
          {{ loadingMore ? 'Loading…' : 'Load more' }}
        </button>
      </div>
      <p v-if="loadMoreFailed" role="alert" class="status status-error">
        Could not load more listings.
      </p>
    </template>
  </section>
</template>

<style scoped>
.listing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.load-more-button {
  min-height: 48px;
  padding: 12px 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.load-more-button:disabled {
  opacity: 0.45;
  cursor: default;
}

@media (min-width: 768px) {
  .listing-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1100px) {
  .listing-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
