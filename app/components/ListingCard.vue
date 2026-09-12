<script setup lang="ts">
defineProps<{ listing: Listing }>()

const brokenImage = ref(false)
</script>

<template>
  <NuxtLink :to="`/listings/${listing.id}`" class="listing-card">
    <img
      v-if="listing.imageUrl && !brokenImage"
      :src="listing.imageUrl"
      :alt="listing.address || 'Listing photo'"
      class="listing-card-image"
      loading="lazy"
      decoding="async"
      @error="brokenImage = true"
    />
    <div v-else class="image-fallback">No photo</div>
    <div class="listing-card-body">
      <p class="listing-card-price">{{ formatPrice(listing.price) }}</p>
      <p v-if="listing.address" class="listing-card-address">
        {{ listing.address }}
      </p>
      <p v-if="listing.city" class="listing-card-city">{{ listing.city }}</p>
      <p class="listing-card-meta">
        {{ listing.rooms ? `${listing.rooms} rooms` : '—' }}
        · {{ formatArea(listing.livingArea) }}
      </p>
    </div>
  </NuxtLink>
</template>

<style scoped>
.listing-card {
  display: block;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.listing-card-image,
.image-fallback {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: var(--placeholder);
}

.image-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 0.9rem;
}

.listing-card-body {
  padding: 14px 16px 16px;
}

.listing-card-price {
  margin: 0 0 4px;
  font-size: 1.2rem;
  font-weight: 700;
}

.listing-card-address {
  margin: 0 0 2px;
}

.listing-card-city,
.listing-card-meta {
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
}

.listing-card-meta {
  margin-top: 8px;
}

@media (min-width: 768px) {
  .listing-card-image,
  .image-fallback {
    height: 220px;
  }
}
</style>
