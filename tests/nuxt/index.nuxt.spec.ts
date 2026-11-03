import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import IndexPage from '~/pages/index.vue'

describe('home page', () => {
  it('renders the environment status', async () => {
    const page = await mountSuspended(IndexPage)

    expect(page.text()).toContain('ProyectoMental')
    expect(page.text()).toContain('El entorno está preparado')
  })
})
