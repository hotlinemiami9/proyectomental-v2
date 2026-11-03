import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import IndexPage from '~/pages/index.vue'

describe('home page', () => {
  it('renders the birth data form', async () => {
    const page = await mountSuspended(IndexPage)

    expect(page.text()).toContain('Tu carta')
    expect(page.text()).toContain('Datos de nacimiento')
    expect(page.find('#birth-name').exists()).toBe(true)
  })
})
