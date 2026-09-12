<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const isMissing = computed(() => props.error.statusCode === 404)

useHead({
  title: () => (isMissing.value ? 'Listing not found' : 'Something went wrong')
})
</script>

<template>
  <NuxtLayout>
    <section class="error-page">
      <p class="error-code">{{ error.statusCode }}</p>
      <h1 class="page-title">
        {{
          isMissing
            ? 'This listing is no longer available'
            : 'Something went wrong'
        }}
      </h1>
      <p class="page-intro">
        {{
          isMissing
            ? 'It may have been sold. You can still browse homes that are for sale.'
            : 'Please try again in a moment.'
        }}
      </p>
      <button
        type="button"
        class="error-button"
        @click="clearError({ redirect: '/' })"
      >
        View listings
      </button>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.error-page {
  padding: 32px 0;
}

.error-code {
  margin: 0 0 8px;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.error-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 12px 20px;
  border: 0;
  border-radius: var(--radius);
  background: var(--accent);
  color: #fff;
}

.error-button:hover {
  background: var(--accent-hover);
}
</style>
