<script setup lang="ts">
const route = useRoute()
const { data: listing, error } = await useFetch(
  `/api/listings/${route.params.id}`
)

if (error.value || !listing.value) {
  throw createError({
    statusCode: error.value?.statusCode ?? 404,
    statusMessage: 'Listing not found'
  })
}

// Getters, so the head tags follow a refetch instead of freezing on first load.
useSeoMeta({
  title: () => listingMetaTitle(listing.value),
  description: () => listingMetaDescription(listing.value)
})

const paragraphs = computed(() =>
  descriptionParagraphs(listing.value?.description)
)
</script>

<template>
  <article v-if="listing">
    <NuxtLink to="/" class="back-link">← All listings</NuxtLink>

    <PhotoGallery :photos="listing.photos" :address="listing.address" />

    <p class="detail-price">{{ formatPrice(listing.price) }}</p>
    <h1 v-if="listing.address" class="detail-address">{{ listing.address }}</h1>
    <p v-if="listing.city" class="detail-city">{{ listing.city }}</p>

    <dl class="facts">
      <div class="fact">
        <dt>Rooms</dt>
        <dd>{{ listing.rooms ?? '—' }}</dd>
      </div>
      <div class="fact">
        <dt>Living area</dt>
        <dd>{{ formatArea(listing.livingArea) }}</dd>
      </div>
      <div class="fact">
        <dt>Plot</dt>
        <dd>{{ formatArea(listing.plotArea) }}</dd>
      </div>
      <div class="fact">
        <dt>Energy label</dt>
        <dd>{{ listing.energyLabel || '—' }}</dd>
      </div>
      <div class="fact">
        <dt>Listed</dt>
        <dd>{{ listing.listedSince || '—' }}</dd>
      </div>
      <div class="fact">
        <dt>Agent</dt>
        <dd>{{ listing.agentName || '—' }}</dd>
      </div>
    </dl>

    <section v-if="paragraphs.length" class="description">
      <h2>Description</h2>
      <p v-for="(paragraph, index) in paragraphs" :key="index">
        {{ paragraph }}
      </p>
    </section>

    <section
      v-if="listing.lat != null && listing.lng != null"
      class="map-section"
    >
      <h2>Location</h2>
      <ClientOnly>
        <PropertyMap :lat="listing.lat" :lng="listing.lng" />
        <!-- Reserve the map's height so hydration does not shift the page. -->
        <template #fallback>
          <div class="map-placeholder" />
        </template>
      </ClientOnly>
    </section>
  </article>
</template>

<style scoped>
.back-link {
  display: inline-block;
  min-height: 44px;
  padding: 10px 0;
  color: var(--accent);
}

.detail-price {
  margin: 0 0 4px;
  font-size: 1.5rem;
}

.detail-address {
  margin: 0 0 4px;
  font-size: 1.25rem;
}

.detail-city {
  margin: 0 0 20px;
  color: var(--muted);
}

.facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 0 0 24px;
  padding: 0;
}

.fact {
  margin: 0;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.fact dt {
  margin: 0 0 4px;
  color: var(--muted);
  font-size: 0.85rem;
}

.fact dd {
  margin: 0;
  font-weight: 700;
}

.description {
  margin: 0 0 24px;
}

.description p {
  margin: 0 0 12px;
}

.map-placeholder {
  height: var(--map-height);
  margin-bottom: 24px;
  background: var(--placeholder);
  border-radius: var(--radius);
}

.map-section h2,
.description h2 {
  margin: 0 0 12px;
  font-size: 1.15rem;
}

@media (min-width: 768px) {
  .facts {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
