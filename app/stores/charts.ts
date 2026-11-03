import { defineStore } from 'pinia'
import type { ChartData, SavedChart } from '~/types/chart'

const STORAGE_KEY = 'proyectomental.charts.v1'

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `chart-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function readStorage(): SavedChart[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is SavedChart =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as SavedChart).id === 'string' &&
        Boolean((item as SavedChart).chart),
    )
  } catch {
    return []
  }
}

export const useChartsStore = defineStore('charts', {
  state: () => ({
    charts: [] as SavedChart[],
    hydrated: false,
  }),
  getters: {
    count: (state) => state.charts.length,
    latest: (state) => state.charts[0] ?? null,
  },
  actions: {
    hydrate() {
      if (this.hydrated) return
      this.charts = readStorage()
      this.hydrated = true
    },
    persist() {
      if (typeof window === 'undefined') return
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.charts))
      } catch {
        // Local storage can be unavailable in private mode; the in-memory state still works.
      }
    },
    save(chart: ChartData) {
      this.hydrate()
      const now = new Date().toISOString()
      const saved: SavedChart = {
        id: createId(),
        createdAt: now,
        updatedAt: now,
        chart,
      }
      this.charts.unshift(saved)
      this.persist()
      return saved
    },
    find(id: string) {
      this.hydrate()
      return this.charts.find((item) => item.id === id) ?? null
    },
    rename(id: string, name: string) {
      const chart = this.find(id)
      if (!chart) return
      chart.chart.input.name = name.trim()
      chart.updatedAt = new Date().toISOString()
      this.persist()
    },
    duplicate(id: string) {
      const original = this.find(id)
      if (!original) return null
      const now = new Date().toISOString()
      const copy: SavedChart = {
        ...structuredClone(original),
        id: createId(),
        createdAt: now,
        updatedAt: now,
      }
      copy.chart.input.name = `${original.chart.input.name} (copia)`
      this.charts.unshift(copy)
      this.persist()
      return copy
    },
    remove(id: string) {
      this.charts = this.charts.filter((item) => item.id !== id)
      this.persist()
    },
  },
})
