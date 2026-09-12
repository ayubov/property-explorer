// @ts-check
import stylistic from '@stylistic/eslint-plugin'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  plugins: {
    '@stylistic': stylistic
  },
  rules: {
    // Let Prettier own void-element slashes (<img />).
    'vue/html-self-closing': 'off',
    '@stylistic/padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' }
    ]
  }
})
