<script setup lang="ts">
import { useChartsStore } from '~/stores/charts'

const store = useChartsStore()
const ready = ref(false)

onMounted(() => {
  store.hydrate()
  ready.value = true
})

function formatDate(value: string) {
  const [year = 0, month = 1, day = 1] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

function rename(id: string, current: string) {
  const name = window.prompt('Nuevo nombre para la carta', current)
  if (name?.trim()) store.rename(id, name)
}

function duplicate(id: string) {
  store.duplicate(id)
}

function remove(id: string, name: string) {
  if (window.confirm(`¿Eliminar la carta de ${name}? Esta acción no se puede deshacer.`)) {
    store.remove(id)
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 pb-20 sm:px-8">
    <SiteHeader />

    <header class="pt-12">
      <p class="text-[11px] tracking-[0.28em] text-gold-300 uppercase">Tu biblioteca</p>
      <h1 class="mt-3 font-serif text-5xl sm:text-6xl">Mis cartas</h1>
      <p class="mt-4 max-w-xl text-sm leading-relaxed text-moon-300 sm:text-base">
        Las cartas se guardan solo en este dispositivo. Puedes volver a ellas, duplicarlas o
        eliminarlas cuando quieras.
      </p>
    </header>

    <div v-if="!ready" class="mt-10 text-sm text-moon-500">Cargando…</div>

    <div
      v-else-if="!store.charts.length"
      class="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center"
    >
      <h2 class="font-serif text-3xl">Todavía no hay cartas.</h2>
      <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-moon-300">
        Calcula tu primera carta y aparecerá aquí, sin crear una cuenta.
      </p>
      <UButton to="/" class="mt-6" icon="i-lucide-sparkles">Calcular una carta</UButton>
    </div>

    <div v-else class="mt-10 grid gap-4">
      <article
        v-for="saved in store.charts"
        :key="saved.id"
        class="rounded-2xl border border-white/10 bg-night-900/60 p-5 transition-colors hover:border-gold-300/30"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-[11px] tracking-[0.18em] text-gold-300 uppercase">
              {{ saved.chart.summary.typeLabel }} · {{ saved.chart.summary.profile }}
            </p>
            <h2 class="mt-2 font-serif text-3xl">{{ saved.chart.input.name }}</h2>
            <p class="mt-1 text-sm text-moon-500">
              {{ formatDate(saved.chart.input.date) }} · {{ saved.chart.input.city }},
              {{ saved.chart.input.country }}
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton :to="`/carta/${saved.id}`" size="sm" icon="i-lucide-arrow-up-right">
              Abrir
            </UButton>
            <UButton
              size="sm"
              variant="ghost"
              color="neutral"
              icon="i-lucide-pencil"
              @click="rename(saved.id, saved.chart.input.name)"
            >
              Renombrar
            </UButton>
            <UButton
              size="sm"
              variant="ghost"
              color="neutral"
              icon="i-lucide-copy"
              @click="duplicate(saved.id)"
            >
              Duplicar
            </UButton>
            <UButton
              size="sm"
              variant="ghost"
              color="error"
              icon="i-lucide-trash-2"
              @click="remove(saved.id, saved.chart.input.name)"
            >
              Eliminar
            </UButton>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
