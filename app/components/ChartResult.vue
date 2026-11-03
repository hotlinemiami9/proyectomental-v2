<script setup lang="ts">
import type { ChartData } from '~/types/chart'
import { centerLabels, getChannelName } from '~/data/chart-labels'
import {
  centerContent,
  getAuthorityContent,
  getProfileContent,
  getTypeContent,
} from '~/data/interpretations'
import { exportElementAsPdf, exportElementAsPng } from '~/utils/export-chart'

const props = defineProps<{ chart: ChartData }>()

const reportRef = ref<HTMLElement | null>(null)
const graphRef = ref<HTMLElement | null>(null)
const exporting = ref<'png' | 'pdf' | null>(null)

const typeContent = computed(() => getTypeContent(props.chart.summary.type))
const authorityContent = computed(() => getAuthorityContent(props.chart.summary.authority))
const profileContent = computed(() => getProfileContent(props.chart.summary.profile))
const definedChannels = computed(() => props.chart.channels.filter((channel) => channel.defined))

function formatDate(value: string) {
  const [year = 0, month = 1, day = 1] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

async function downloadPng() {
  if (!graphRef.value) return
  exporting.value = 'png'
  try {
    await exportElementAsPng(graphRef.value, props.chart.input.name)
  } finally {
    exporting.value = null
  }
}

async function downloadPdf() {
  if (!reportRef.value) return
  exporting.value = 'pdf'
  try {
    await exportElementAsPdf(reportRef.value, props.chart.input.name)
  } finally {
    exporting.value = null
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-[11px] tracking-[0.24em] text-gold-300 uppercase">Carta de Diseño Humano</p>
        <h1 class="mt-2 font-serif text-4xl sm:text-5xl">{{ chart.input.name }}</h1>
        <p class="mt-2 text-sm text-moon-500">
          {{ formatDate(chart.input.date) }} · {{ chart.input.time }} h · {{ chart.input.city }},
          {{ chart.input.country }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <UButton
          variant="outline"
          color="neutral"
          icon="i-lucide-image"
          :loading="exporting === 'png'"
          @click="downloadPng"
        >
          PNG
        </UButton>
        <UButton
          variant="outline"
          color="neutral"
          icon="i-lucide-file-text"
          :loading="exporting === 'pdf'"
          @click="downloadPdf"
        >
          PDF
        </UButton>
      </div>
    </div>

    <div
      v-if="chart.stability"
      class="mt-6 rounded-2xl border border-gold-300/30 bg-gold-300/5 p-4 text-sm leading-relaxed text-moon-300"
    >
      <strong class="text-gold-300">Hora aproximada.</strong>
      La carta se ha calculado con la hora indicada. En un margen de ±30 minutos
      <span v-if="chart.stability.unstableFields.length">
        pueden variar: {{ chart.stability.unstableFields.join(', ') }}.
      </span>
      <span v-else>los campos principales se mantienen estables.</span>
    </div>

    <div
      ref="reportRef"
      class="mt-8 space-y-8 rounded-[1.8rem] border border-white/10 bg-night-900/60 p-5 sm:p-8"
    >
      <section class="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div ref="graphRef" class="rounded-3xl bg-night-950 p-2">
          <BodyGraph :chart="chart" />
        </div>
        <div class="space-y-3">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-[11px] tracking-[0.18em] text-moon-500 uppercase">Tipo</p>
            <p class="mt-1 font-serif text-2xl">{{ chart.summary.typeLabel }}</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-[11px] tracking-[0.18em] text-moon-500 uppercase">Estrategia</p>
            <p class="mt-1 text-lg">{{ chart.summary.strategyLabel }}</p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-[11px] tracking-[0.18em] text-moon-500 uppercase">Autoridad</p>
              <p class="mt-1 text-sm">{{ chart.summary.authorityLabel }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-[11px] tracking-[0.18em] text-moon-500 uppercase">Perfil</p>
              <p class="mt-1 text-sm">{{ chart.summary.profile }}</p>
            </div>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-[11px] tracking-[0.18em] text-moon-500 uppercase">Definición</p>
            <p class="mt-1 text-sm">{{ chart.summary.definitionLabel }}</p>
          </div>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-3">
        <article class="rounded-2xl border border-white/10 p-5">
          <p class="text-[11px] tracking-[0.18em] text-gold-300 uppercase">Tu tipo</p>
          <h2 class="mt-2 font-serif text-2xl">{{ typeContent.title }}</h2>
          <p class="mt-3 text-sm leading-relaxed text-moon-300">{{ typeContent.body }}</p>
        </article>
        <article class="rounded-2xl border border-white/10 p-5">
          <p class="text-[11px] tracking-[0.18em] text-gold-300 uppercase">Tu autoridad</p>
          <h2 class="mt-2 font-serif text-2xl">{{ authorityContent.title }}</h2>
          <p class="mt-3 text-sm leading-relaxed text-moon-300">{{ authorityContent.body }}</p>
        </article>
        <article class="rounded-2xl border border-white/10 p-5">
          <p class="text-[11px] tracking-[0.18em] text-gold-300 uppercase">Tu perfil</p>
          <h2 class="mt-2 font-serif text-2xl">{{ profileContent.title }}</h2>
          <p class="mt-3 text-sm leading-relaxed text-moon-300">{{ profileContent.body }}</p>
        </article>
      </section>

      <section>
        <div class="flex items-end justify-between gap-3">
          <div>
            <p class="text-[11px] tracking-[0.18em] text-gold-300 uppercase">Centros</p>
            <h2 class="mt-1 font-serif text-2xl">Definidos y abiertos</h2>
          </div>
          <p class="text-xs text-moon-500">
            {{ chart.centers.filter((center) => center.defined).length }} definidos
          </p>
        </div>
        <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="center in chart.centers"
            :key="center.id"
            class="rounded-2xl border p-4"
            :class="
              center.defined
                ? 'border-aurora-500/40 bg-aurora-500/10'
                : 'border-white/10 bg-white/5'
            "
          >
            <div class="flex items-center justify-between gap-2">
              <h3 class="font-serif text-xl">{{ center.label }}</h3>
              <UBadge :color="center.defined ? 'primary' : 'neutral'" variant="outline" size="sm">
                {{ center.defined ? 'Definido' : 'Abierto' }}
              </UBadge>
            </div>
            <p class="mt-2 text-sm leading-relaxed text-moon-300">
              {{ centerContent[center.id].body }}
            </p>
          </article>
        </div>
      </section>

      <section>
        <p class="text-[11px] tracking-[0.18em] text-gold-300 uppercase">Canales activos</p>
        <h2 class="mt-1 font-serif text-2xl">La energía que conecta tus centros</h2>
        <div v-if="definedChannels.length" class="mt-4 grid gap-3 sm:grid-cols-2">
          <div
            v-for="channel in definedChannels"
            :key="channel.key"
            class="rounded-2xl border border-gold-300/25 bg-gold-300/5 p-4"
          >
            <p class="text-sm text-gold-300">Canal {{ channel.key }}</p>
            <p class="mt-1 font-serif text-xl">{{ getChannelName(channel.key, channel.name) }}</p>
            <p class="mt-1 text-xs text-moon-500">
              {{ centerLabels[channel.centers[0]] }} ↔ {{ centerLabels[channel.centers[1]] }}
            </p>
          </div>
        </div>
        <p v-else class="mt-4 text-sm text-moon-500">
          No hay canales completos activos en esta carta.
        </p>
      </section>

      <section>
        <p class="text-[11px] tracking-[0.18em] text-gold-300 uppercase">Puertas activas</p>
        <h2 class="mt-1 font-serif text-2xl">Tus activaciones</h2>
        <div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div
            v-for="gate in chart.gates"
            :key="gate.gate"
            class="rounded-xl border border-white/10 p-3 text-sm"
          >
            <p class="font-serif text-lg text-gold-300">Puerta {{ gate.gate }}</p>
            <p class="mt-0.5 text-xs text-moon-500">{{ centerLabels[gate.center] }}</p>
            <p class="mt-2 text-[11px] text-moon-300">
              <span v-if="gate.personality.length">P: {{ gate.personality.join(', ') }}</span>
              <span v-if="gate.design.length"> · D: {{ gate.design.join(', ') }}</span>
            </p>
          </div>
        </div>
      </section>

      <footer class="border-t border-white/10 pt-4 text-xs leading-relaxed text-moon-500">
        Esta lectura es una invitación a la autoobservación, no una descripción definitiva ni una
        recomendación médica, psicológica o financiera.
      </footer>
    </div>

    <div class="mt-6 flex flex-wrap gap-3">
      <UButton to="/cartas" variant="outline" color="neutral" icon="i-lucide-library">
        Mis cartas
      </UButton>
      <UButton to="/" variant="ghost" color="neutral" icon="i-lucide-plus"> Calcular otra </UButton>
    </div>
  </div>
</template>
