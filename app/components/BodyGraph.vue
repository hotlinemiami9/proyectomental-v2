<script setup lang="ts">
import type { CenterId, ChartActivation, ChartData } from '~/types/chart'
import { renderToSVG } from '~/lib/bodygraph'
import type { Activations, CenterName } from '~/lib/bodygraph'

const props = defineProps<{ chart: ChartData }>()

const centerNames: Record<CenterId, CenterName> = {
  head: 'Head',
  ajna: 'Ajna',
  throat: 'Throat',
  g: 'G',
  heart: 'Ego',
  sacral: 'Sacral',
  solarplexus: 'SolarPlexus',
  spleen: 'Spleen',
  root: 'Root',
}

const activationKeys: Record<string, keyof Activations> = {
  sun: 'sun',
  earth: 'earth',
  moon: 'moon',
  north_node: 'northNode',
  south_node: 'southNode',
  mercury: 'mercury',
  venus: 'venus',
  mars: 'mars',
  jupiter: 'jupiter',
  saturn: 'saturn',
  uranus: 'uranus',
  neptune: 'neptune',
  pluto: 'pluto',
}

function activationMap(activations: ChartActivation[]) {
  const map: Activations = {}

  for (const activation of activations) {
    const key = activationKeys[activation.body]
    if (key) map[key] = `${activation.gate}.${activation.line}`
  }

  return map
}

function uniqueGates(activations: ChartActivation[]) {
  return [...new Set(activations.map((activation) => activation.gate))]
}

const bodygraphSvg = computed(() => {
  const { chart } = props

  return renderToSVG(
    {
      personalityGates: uniqueGates(chart.activations.personality),
      designGates: uniqueGates(chart.activations.design),
      definedCenters: chart.centers
        .filter((center) => center.defined)
        .map((center) => centerNames[center.id]),
      channels: chart.channels.filter((channel) => channel.defined).map((channel) => channel.key),
      type: chart.summary.typeLabel,
      profile: chart.summary.profile,
      definition: chart.summary.definitionLabel,
      authority: chart.summary.authorityLabel,
      strategy: chart.summary.strategyLabel,
      activations: {
        design: activationMap(chart.activations.design),
        personality: activationMap(chart.activations.personality),
      },
    },
    {
      theme: 'dark',
      width: 820,
      showGateNumbers: true,
      showCenterLabels: true,
      showActivationColumns: true,
      showBodySilhouette: true,
      showSpine: true,
      spineLineCount: 7,
    },
  )
})
</script>

<template>
  <figure class="rounded-3xl border border-white/10 bg-night-950/80 p-3">
    <div class="overflow-x-auto">
      <!-- eslint-disable vue/no-v-html -- SVG generated from trusted chart data -->
      <div
        class="bodygraph-svg mx-auto max-w-[820px] min-w-[680px] sm:min-w-0"
        role="img"
        :aria-label="`BodyGraph de ${chart.input.name}`"
        v-html="bodygraphSvg"
      />
      <!-- eslint-enable vue/no-v-html -->
    </div>

    <figcaption
      class="mt-2 flex flex-wrap justify-center gap-4 text-[10px] tracking-[0.12em] text-moon-500 uppercase"
    >
      <span class="inline-flex items-center gap-1.5">
        <span class="size-2 rounded-full bg-aurora-500" />
        Centro definido
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span class="size-2 rounded-full border border-white/30" />
        Centro abierto
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span class="h-0.5 w-4 bg-gold-300" />
        Canal activo
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span class="size-2 rounded-sm bg-aurora-300" />
        Puerta activa
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.bodygraph-svg :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 1rem;
}

@media (max-width: 639px) {
  .bodygraph-svg :deep(#activation-columns) {
    display: none;
  }
}
</style>
