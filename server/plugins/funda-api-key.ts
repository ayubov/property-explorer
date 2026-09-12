// Checked on boot rather than in nuxt.config, so building never needs the key.
export default defineNitroPlugin(() => {
  if (!useRuntimeConfig().fundaApiKey) {
    throw new Error('Missing NUXT_FUNDA_API_KEY')
  }
})
