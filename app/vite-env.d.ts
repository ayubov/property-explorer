// Vite's `?worker&url` suffix returns the emitted asset url; see PropertyMap.vue.
declare module '*?worker&url' {
  const url: string
  export default url
}
