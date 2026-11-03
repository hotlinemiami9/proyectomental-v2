<script setup lang="ts">
import type { CenterId, ChartData } from '~/types/chart'

const props = defineProps<{ chart: ChartData }>()

const positions: Record<
  CenterId,
  { x: number; y: number; shape: 'rect' | 'triangle' | 'diamond' }
> = {
  head: { x: 160, y: 42, shape: 'triangle' },
  ajna: { x: 160, y: 102, shape: 'triangle' },
  throat: { x: 160, y: 164, shape: 'rect' },
  g: { x: 160, y: 238, shape: 'diamond' },
  heart: { x: 92, y: 235, shape: 'triangle' },
  spleen: { x: 230, y: 290, shape: 'triangle' },
  sacral: { x: 160, y: 318, shape: 'rect' },
  solarplexus: { x: 92, y: 356, shape: 'triangle' },
  root: { x: 160, y: 424, shape: 'rect' },
}

const centerList = computed(() => props.chart.centers)

function channelPath(channel: ChartData['channels'][number], index: number) {
  const a = positions[channel.centers[0]]
  const b = positions[channel.centers[1]]
  const dx = b.x - a.x
  const dy = b.y - a.y
  const length = Math.hypot(dx, dy) || 1
  const offset = (index % 2 === 0 ? 1 : -1) * (4 + (index % 3) * 2)
  const mx = (a.x + b.x) / 2 - (dy / length) * offset
  const my = (a.y + b.y) / 2 + (dx / length) * offset
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`
}

function trianglePoints(center: { x: number; y: number }, down = false) {
  const width = 44
  const height = 34
  if (down) {
    return `${center.x - width / 2},${center.y - height / 2} ${center.x + width / 2},${center.y - height / 2} ${center.x},${center.y + height / 2}`
  }
  return `${center.x},${center.y - height / 2} ${center.x + width / 2},${center.y + height / 2} ${center.x - width / 2},${center.y + height / 2}`
}

function diamondPoints(center: { x: number; y: number }) {
  return `${center.x},${center.y - 28} ${center.x + 32},${center.y} ${center.x},${center.y + 28} ${center.x - 32},${center.y}`
}
</script>

<template>
  <figure class="rounded-3xl border border-white/10 bg-night-950/80 p-3">
    <svg
      class="mx-auto block h-auto w-full max-w-[360px]"
      viewBox="0 0 320 480"
      role="img"
      aria-labelledby="bodygraph-title bodygraph-desc"
    >
      <title id="bodygraph-title">BodyGraph de {{ chart.input.name }}</title>
      <desc id="bodygraph-desc">
        Representación de los nueve centros, canales y puertas activadas en esta carta.
      </desc>

      <g aria-hidden="true">
        <path
          v-for="(channel, index) in chart.channels"
          :key="channel.key"
          :d="channelPath(channel, index)"
          fill="none"
          :stroke="channel.defined ? '#f2d48f' : 'rgba(247, 242, 232, 0.12)'"
          :stroke-width="channel.defined ? 4 : 2"
          stroke-linecap="round"
        />
      </g>

      <g v-for="center in centerList" :key="center.id">
        <polygon
          v-if="positions[center.id].shape === 'triangle'"
          :points="trianglePoints(positions[center.id], center.id === 'head')"
          :fill="center.defined ? '#8b5cf6' : '#0d1020'"
          :stroke="center.defined ? '#c4b5fd' : 'rgba(247, 242, 232, 0.3)'"
          stroke-width="2"
        />
        <polygon
          v-else-if="positions[center.id].shape === 'diamond'"
          :points="diamondPoints(positions[center.id])"
          :fill="center.defined ? '#8b5cf6' : '#0d1020'"
          :stroke="center.defined ? '#c4b5fd' : 'rgba(247, 242, 232, 0.3)'"
          stroke-width="2"
        />
        <rect
          v-else
          :x="positions[center.id].x - 34"
          :y="positions[center.id].y - 21"
          width="68"
          height="42"
          rx="8"
          :fill="center.defined ? '#8b5cf6' : '#0d1020'"
          :stroke="center.defined ? '#c4b5fd' : 'rgba(247, 242, 232, 0.3)'"
          stroke-width="2"
        />
        <text
          :x="positions[center.id].x"
          :y="positions[center.id].y + 4"
          text-anchor="middle"
          fill="#f7f2e8"
          font-size="9"
          font-family="Manrope Variable, sans-serif"
        >
          {{ center.label }}
        </text>
      </g>
    </svg>

    <figcaption
      class="mt-2 flex flex-wrap justify-center gap-4 text-[10px] tracking-[0.12em] text-moon-500 uppercase"
    >
      <span class="inline-flex items-center gap-1.5">
        <span class="size-2 rounded-full bg-aurora-500" />
        Definido
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span class="size-2 rounded-full border border-white/30" />
        Abierto
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span class="h-0.5 w-4 bg-gold-300" />
        Canal activo
      </span>
    </figcaption>
  </figure>
</template>
