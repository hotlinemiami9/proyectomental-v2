// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { calculateChart } from '../../server/utils/chart-engine'

describe('calculateChart', () => {
  it('calculates a complete chart and derives its definition', () => {
    const chart = calculateChart({
      name: 'Prueba',
      date: '1972-08-02',
      time: '14:30',
      city: 'Bangkok',
      country: 'Thailand',
      lat: 13.75,
      lng: 100.5,
      timezone: 'Asia/Bangkok',
    })

    expect(chart.summary.type).toBe('Manifesting Generator')
    expect(chart.summary.profile).toBe('3/5')
    expect(chart.centers).toHaveLength(9)
    expect(chart.channels).toHaveLength(36)
    expect(chart.gates.length).toBeGreaterThan(0)
    expect(['none', 'single', 'split', 'triple', 'quadruple']).toContain(chart.summary.definition)
  })
})
