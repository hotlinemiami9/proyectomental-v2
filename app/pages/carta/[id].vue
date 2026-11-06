<script setup lang="ts">
import { useChartsStore } from '~/stores/charts'

const route = useRoute()
const store = useChartsStore()
const ready = ref(false)

onMounted(() => {
  store.hydrate()
  ready.value = true
})

const saved = computed(() => (ready.value ? store.find(String(route.params.id)) : null))

useHead({
  title: computed(() =>
    formatPageTitle(
      saved.value ? `Carta de ${saved.value.chart.input.name}` : 'Carta no encontrada',
    ),
  ),
})

useSeoMeta({
  description: 'Carta de Diseño Humano calculada en ProyectoMental.',
})
</script>

<template>
  <div class="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
    <SiteHeader />

    <div v-if="!ready" class="pt-16 text-sm text-moon-500">Cargando carta…</div>

    <div v-else-if="!saved" class="pt-16">
      <p class="text-[11px] tracking-[0.28em] text-gold-300 uppercase">Carta no disponible</p>
      <h1 class="mt-3 font-serif text-5xl">No encontramos esta carta.</h1>
      <p class="mt-4 max-w-lg text-sm leading-relaxed text-moon-300">
        Puede que se haya eliminado o que se guardara en otro dispositivo. Las cartas locales no se
        sincronizan sin cuenta.
      </p>
      <div class="mt-7 flex gap-3">
        <UButton to="/" icon="i-lucide-sparkles">Calcular una carta</UButton>
        <UButton to="/cartas" variant="outline" color="neutral">Mis cartas</UButton>
      </div>
    </div>

    <ChartResult v-else :chart="saved.chart" />
  </div>
</template>
