<template>
  <header class="site-header">
    <div class="site-header-inner">
      <NuxtLink to="/" class="logo">Property explorer</NuxtLink>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.site-header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 14px 16px;
}

.logo {
  font-size: 1.15rem;
  font-weight: 700;
}
</style>
