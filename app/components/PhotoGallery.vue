<script setup lang="ts">
const props = defineProps<{ photos: string[]; address: string | null }>()

// A hero plus up to 4 thumbs. The last thumb sits under the +N overlay, so
// only 4 photos are really visible and N counts from there.
const THUMB_COUNT = 4

// Urls that 404'd.
const broken = ref(new Set<string>())
// Index of the photo open in the lightbox, or null when it is closed.
const viewing = ref<number | null>(null)
const dialogEl = ref<HTMLDialogElement | null>(null)

// Drop photos that failed to load, so one dead url cannot hide the rest.
const photos = computed(() =>
  props.photos.filter((url) => !broken.value.has(url))
)

const hero = computed(() => photos.value[0] || '')
const thumbs = computed(() => photos.value.slice(1, 1 + THUMB_COUNT))
const moreCount = computed(() => Math.max(0, photos.value.length - THUMB_COUNT))

// What the lightbox should show.
const viewingUrl = computed(() =>
  viewing.value == null ? '' : photos.value[viewing.value] || ''
)

// Changing an <img> src blanks it until the new file arrives, which makes Next
// flash white on slow connections. So render the photo that finished loading
// and dim it until the next one is ready.
const displayUrl = ref('')
const imagePending = ref(false)

const photoAlt = (photoIndex: number) =>
  `${props.address || 'Listing'} photo ${photoIndex + 1}`

// The last thumb is hidden behind the +N overlay, so name what it really does.
const thumbLabel = (thumbIndex: number) =>
  thumbIndex === thumbs.value.length - 1 && moreCount.value
    ? `View all ${photos.value.length} photos`
    : photoAlt(thumbIndex + 1)

const preload = (url: string | undefined) => {
  if (!url || !import.meta.client) return
  const image = new Image()
  image.src = url
}

const open = (photoIndex: number) => {
  viewing.value = photoIndex
  dialogEl.value?.showModal()
}

const close = () => {
  dialogEl.value?.close()
}

// Escape closes the dialog without going through close(), so state is reset
// from the dialog's own close event instead.
const onClosed = () => {
  viewing.value = null
  displayUrl.value = ''
}

const viewPrev = () => {
  if (viewing.value == null || viewing.value === 0) return
  viewing.value -= 1
}

const viewNext = () => {
  if (viewing.value == null || viewing.value >= photos.value.length - 1) return
  viewing.value += 1
}

// Arrows only: <dialog> already handles Escape, focus trapping and restore.
const onKey = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') viewPrev()
  if (event.key === 'ArrowRight') viewNext()
}

watch(viewingUrl, async (url) => {
  if (!url) return

  // Neighbours only. Preloading every photo would cost megabytes for visitors
  // who never open the gallery.
  preload(photos.value[(viewing.value ?? 0) + 1])
  preload(photos.value[(viewing.value ?? 0) - 1])

  imagePending.value = url !== displayUrl.value
  const image = new Image()
  await new Promise<void>((resolve) => {
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = url
  })
  // User may already have skipped ahead; drop this stale load.
  if (viewingUrl.value !== url) return

  displayUrl.value = url
  imagePending.value = false
})
</script>

<template>
  <section class="gallery" aria-label="Photo gallery">
    <div
      v-if="hero"
      class="gallery-mosaic"
      :class="{ 'is-single': thumbs.length === 0 }"
    >
      <button type="button" class="gallery-hero" @click="open(0)">
        <img
          :src="hero"
          :alt="photoAlt(0)"
          fetchpriority="high"
          decoding="async"
          @error="broken.add(hero)"
        />
      </button>
      <div v-if="thumbs.length" class="gallery-thumbs">
        <button
          v-for="(url, thumbIndex) in thumbs"
          :key="url"
          type="button"
          class="gallery-thumb"
          :aria-label="thumbLabel(thumbIndex)"
          @click="open(thumbIndex + 1)"
        >
          <img
            :src="url"
            :alt="photoAlt(thumbIndex + 1)"
            loading="lazy"
            decoding="async"
            @error="broken.add(url)"
          />
          <span
            v-if="thumbIndex === thumbs.length - 1 && moreCount"
            class="gallery-more"
          >
            +{{ moreCount }}
          </span>
        </button>
      </div>
    </div>
    <div v-else class="gallery-fallback">No photo</div>
    <p v-if="photos.length" class="gallery-count">
      {{ photos.length }} {{ photos.length === 1 ? 'photo' : 'photos' }}
    </p>

    <!-- A modal dialog renders in the browser's top layer, so the page layout
         cannot clip it and focus cannot escape it. -->
    <dialog
      ref="dialogEl"
      class="gallery-viewer"
      :aria-label="`Photo ${(viewing ?? 0) + 1} of ${photos.length}`"
      @close="onClosed"
      @keydown="onKey"
      @click.self="close"
    >
      <template v-if="viewing != null">
        <button type="button" class="gallery-viewer-close" @click="close">
          Close
        </button>
        <img
          v-if="displayUrl"
          :src="displayUrl"
          :alt="photoAlt(viewing)"
          :class="{ 'is-pending': imagePending }"
        />
        <p v-else class="gallery-viewer-status">Loading…</p>
        <div class="gallery-viewer-bar">
          <button
            type="button"
            class="gallery-viewer-nav"
            :disabled="viewing === 0"
            @click="viewPrev"
          >
            Previous
          </button>
          <p class="gallery-viewer-count">
            {{ viewing + 1 }} / {{ photos.length }}
          </p>
          <button
            type="button"
            class="gallery-viewer-nav"
            :disabled="viewing === photos.length - 1"
            @click="viewNext"
          >
            Next
          </button>
        </div>
      </template>
    </dialog>
  </section>
</template>

<style scoped>
.gallery {
  margin: 0 0 24px;
}

.gallery-mosaic {
  display: grid;
  gap: 8px;
}

.gallery-hero {
  overflow: hidden;
  padding: 0;
  border: 0;
  aspect-ratio: 16 / 9;
  background: var(--placeholder);
  border-radius: var(--radius);
}

.gallery-hero img,
.gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-thumbs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.gallery-thumb {
  position: relative;
  overflow: hidden;
  padding: 0;
  border: 0;
  aspect-ratio: 4 / 3;
  background: var(--placeholder);
  border-radius: 8px;
}

.gallery-more {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(28 25 23 / 45%);
  color: #fff;
  font-weight: 700;
}

.gallery-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 240px;
  background: var(--placeholder);
  border-radius: var(--radius);
  color: var(--muted);
}

.gallery-count {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.gallery-viewer {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  margin: 0;
  padding: 56px 16px 16px;
  border: 0;
  background: none;
  color: inherit;
}

.gallery-viewer[open] {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
}

.gallery-viewer::backdrop {
  background: rgb(28 25 23 / 82%);
}

.gallery-viewer img {
  max-width: min(960px, 92vw);
  max-height: 72vh;
  object-fit: contain;
}

.gallery-viewer img.is-pending {
  opacity: 0.55;
}

.gallery-viewer-status {
  margin: 0;
  color: #fff;
}

.gallery-viewer-close,
.gallery-viewer-nav {
  min-height: 44px;
  padding: 8px 14px;
  border: 0;
  border-radius: 8px;
  background: var(--surface);
}

.gallery-viewer-close {
  position: absolute;
  top: 16px;
  right: 16px;
}

.gallery-viewer-bar {
  display: flex;
  gap: 12px;
  align-items: center;
}

.gallery-viewer-nav:disabled {
  opacity: 0.45;
  cursor: default;
}

.gallery-viewer-count {
  margin: 0;
  min-width: 4.5rem;
  color: #fff;
  text-align: center;
}

@media (min-width: 768px) {
  .gallery-mosaic {
    grid-template-columns: 2fr 1fr;
    height: 400px;
  }

  .gallery-mosaic.is-single {
    grid-template-columns: 1fr;
  }

  .gallery-hero {
    aspect-ratio: auto;
    height: 100%;
  }

  .gallery-thumbs {
    grid-template-rows: 1fr 1fr;
    height: 100%;
    min-height: 0;
  }

  .gallery-thumb {
    aspect-ratio: auto;
    min-height: 0;
  }
}
</style>
