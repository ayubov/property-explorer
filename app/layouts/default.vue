<script setup lang="ts">
// Lives here rather than in app.vue so the error page gets the suffix too.
useHead({
  titleTemplate: (title) =>
    title ? `${title} · Property explorer` : 'Property explorer'
})
</script>

<template>
  <div class="app">
    <SiteHeader />
    <main class="site-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100dvh;
}

.site-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 16px 48px;
}
</style>
