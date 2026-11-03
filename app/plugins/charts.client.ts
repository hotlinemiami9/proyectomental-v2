import { useChartsStore } from '~/stores/charts'

export default defineNuxtPlugin(() => {
  const store = useChartsStore()
  store.hydrate()
})
