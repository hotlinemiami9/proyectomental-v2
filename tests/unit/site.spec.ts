// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { formatPageTitle, SITE_NAME } from '~/utils/site'

describe('formatPageTitle', () => {
  it('returns the site name when there is no page title', () => {
    expect(formatPageTitle()).toBe(SITE_NAME)
  })

  it('joins the page and site names', () => {
    expect(formatPageTitle('Privacidad')).toBe('Privacidad · ProyectoMental')
  })
})
