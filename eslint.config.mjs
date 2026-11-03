// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['.nuxt/**', '.output/**', 'coverage/**', 'playwright-report/**', 'test-results/**'],
})
