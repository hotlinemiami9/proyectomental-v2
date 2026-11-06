import { CHANNELS, GATE_CENTER, computeChart } from 'free-human-design'
import type {
  BirthInput,
  CenterId,
  ChartActivation,
  ChartCenter,
  ChartChannel,
  ChartData,
  ChartGate,
} from '~~/app/types/chart'
import {
  centerLabels,
  getStrategy,
  translateAuthority,
  translateDefinition,
  translateType,
} from '~~/app/data/chart-labels'

function definitionFrom(definedCenters: string[], channels: Array<{ centers: [string, string] }>) {
  if (definedCenters.length === 0) return 'none'

  const adjacency = new Map<string, Set<string>>()
  for (const center of definedCenters) adjacency.set(center, new Set())

  for (const channel of channels) {
    const [a, b] = channel.centers
    if (adjacency.has(a) && adjacency.has(b)) {
      adjacency.get(a)?.add(b)
      adjacency.get(b)?.add(a)
    }
  }

  const seen = new Set<string>()
  let components = 0

  for (const center of definedCenters) {
    if (seen.has(center)) continue
    components += 1
    const queue = [center]
    seen.add(center)

    while (queue.length > 0) {
      const current = queue.shift()
      if (!current) continue
      for (const next of adjacency.get(current) ?? []) {
        if (seen.has(next)) continue
        seen.add(next)
        queue.push(next)
      }
    }
  }

  if (components >= 4) return 'quadruple'
  if (components === 3) return 'triple'
  if (components === 2) return 'split'
  return 'single'
}

function toActivation(activation: {
  body: string
  gate: number
  line: number
  color: number
  retrograde: boolean
}): ChartActivation {
  return {
    body: activation.body,
    gate: activation.gate,
    line: activation.line,
    color: activation.color,
    retrograde: activation.retrograde,
  }
}

function buildChart(input: BirthInput, raw: ReturnType<typeof computeChart>): ChartData {
  const hd = raw.humanDesign
  const definedKeys = new Set(hd.definedChannels.map((channel) => channel.key))
  const definition = definitionFrom(hd.definedCenters, hd.definedChannels)

  const centers: ChartCenter[] = (Object.keys(centerLabels) as CenterId[]).map((id) => ({
    id,
    label: centerLabels[id],
    defined: Boolean(hd.centers[id]),
  }))

  const channels: ChartChannel[] = CHANNELS.map((channel) => ({
    key: channel.key,
    name: channel.name,
    gates: channel.gates,
    centers: channel.centers as [CenterId, CenterId],
    defined: definedKeys.has(channel.key),
  }))

  const gates: ChartGate[] = Object.entries(hd.gateActivations)
    .map(([gate, activations]) => {
      const gateNumber = Number(gate)
      const personality = activations
        .filter((activation) => activation.stream === 'personality')
        .map((activation) => activation.line)
      const design = activations
        .filter((activation) => activation.stream === 'design')
        .map((activation) => activation.line)

      return {
        gate: gateNumber,
        center: GATE_CENTER[gateNumber] as CenterId,
        personality,
        design,
      }
    })
    .sort((a, b) => a.gate - b.gate)

  return {
    input: {
      ...input,
      birthUtc: raw.input.birth_utc,
    },
    summary: {
      type: hd.type,
      typeLabel: translateType(hd.type),
      strategy: getStrategy(hd.type),
      strategyLabel: getStrategy(hd.type),
      authority: hd.authority,
      authorityLabel: translateAuthority(hd.authority),
      profile: hd.profile,
      definition,
      definitionLabel: translateDefinition(definition),
    },
    centers,
    channels,
    gates,
    activations: {
      personality: hd.activations.personality.map(toActivation),
      design: hd.activations.design.map(toActivation),
    },
  }
}

export function calculateChart(input: BirthInput): ChartData {
  const raw = computeChart({
    birthdate: input.date,
    birthtime: input.time,
    timezone: input.timezone,
    location: { lat: input.lat, lng: input.lng },
  })

  return buildChart(input, raw)
}
