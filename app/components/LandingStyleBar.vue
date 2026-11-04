<script setup lang="ts">
import type { LandingStyle } from '~/data/landing-styles'

defineProps<{
  styles: LandingStyle[]
  activeId: string
  collapsed: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  toggle: []
}>()
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50" data-landing-style-bar>
    <div
      class="border-b border-white/10 backdrop-blur-xl transition-all duration-300"
      :class="
        collapsed ? 'bg-night-950/30 py-1.5 opacity-60 hover:opacity-100' : 'bg-night-950/75 py-3'
      "
    >
      <div class="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6">
        <div class="flex min-w-0 items-center gap-2">
          <span class="text-[10px] tracking-[0.22em] text-moon-500 uppercase">
            {{ collapsed ? 'Estilos' : 'Estilos de landing' }}
          </span>
          <span v-if="collapsed" class="truncate text-xs text-moon-300">
            {{ styles.find((style) => style.id === activeId)?.label }}
          </span>
        </div>

        <div
          v-if="!collapsed"
          class="flex flex-1 flex-wrap gap-1.5"
          role="group"
          aria-label="Cambiar estilo de landing"
        >
          <button
            v-for="style in styles"
            :key="style.id"
            type="button"
            class="rounded-full border px-3 py-1.5 text-xs transition-all"
            :class="
              style.id === activeId
                ? 'border-transparent text-[color:var(--accent-contrast)]'
                : 'border-white/15 text-moon-300 hover:border-white/30 hover:text-moon-100'
            "
            :style="style.id === activeId ? { background: 'var(--accent)' } : undefined"
            :aria-pressed="style.id === activeId"
            :data-style-id="style.id"
            @click="emit('select', style.id)"
          >
            {{ style.label }}
          </button>
        </div>

        <button
          type="button"
          class="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-moon-300 transition-colors hover:border-white/30 hover:text-moon-100"
          :aria-label="
            collapsed ? 'Mostrar selector de estilos' : 'Casi ocultar selector de estilos'
          "
          @click="emit('toggle')"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path
              v-if="collapsed"
              d="M1 6 Q6 1 11 6 Q6 11 1 6 Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
            />
            <path v-else d="M1 2 H11 M2 6 H10 M3 10 H9" stroke="currentColor" stroke-width="1.2" />
          </svg>
          {{ collapsed ? 'Mostrar' : 'Casi ocultar' }}
        </button>
      </div>
    </div>
  </header>
</template>
