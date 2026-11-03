<script setup lang="ts">
import { useChartsStore } from '~/stores/charts'

const store = useChartsStore()
</script>

<template>
  <header class="flex flex-wrap items-center justify-between gap-4 py-5">
    <NuxtLink to="/" class="inline-flex items-center gap-2.5 text-moon-100 no-underline">
      <svg class="text-gold-300" width="15" height="15" viewBox="0 0 14 14" aria-hidden="true">
        <path
          fill="currentColor"
          d="M7 0.4 8.15 5.15 13.2 7 8.15 8.85 7 13.6 5.85 8.85 0.8 7 5.85 5.15Z"
        />
      </svg>
      <span class="font-serif text-xl">ProyectoMental</span>
    </NuxtLink>

    <nav class="flex items-center gap-5 text-sm text-moon-300" aria-label="Navegación principal">
      <NuxtLink to="/" class="transition-colors hover:text-moon-100">Inicio</NuxtLink>
      <NuxtLink to="/cartas" class="transition-colors hover:text-moon-100">
        Mis cartas
        <span v-if="store.count" class="ml-1 text-xs text-gold-300">({{ store.count }})</span>
      </NuxtLink>
    </nav>
  </header>
</template>
