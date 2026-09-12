<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Map as MapLibreMap } from 'maplibre-gl'

const props = defineProps<{ lat: number; lng: number }>()

const mapEl = ref<HTMLElement | null>(null)
let map: MapLibreMap | null = null
let disposed = false

// MapLibre needs window + a worker; import only after mount.
onMounted(async () => {
  if (!mapEl.value) return

  const { Map, Marker, setWorkerUrl } = await import('maplibre-gl')
  const { default: workerUrl } =
    await import('maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url')
  setWorkerUrl(workerUrl)

  // The imports above are async, so the page may already be gone.
  if (disposed || !mapEl.value) return

  const instance = new Map({
    container: mapEl.value,
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [props.lng, props.lat],
    zoom: 15
  })

  new Marker({ color: '#0f766e' })
    .setLngLat([props.lng, props.lat])
    .addTo(instance)
  instance.resize()
  map = instance
})

onUnmounted(() => {
  disposed = true
  map?.remove()
})
</script>

<template>
  <div ref="mapEl" class="property-map" />
</template>

<style scoped>
.property-map {
  width: 100%;
  height: var(--map-height);
  margin-bottom: 24px;
  border-radius: var(--radius);
  overflow: hidden;
}
</style>
