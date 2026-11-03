import { DateTime } from 'luxon'
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

function shiftLocalTime(input: BirthInput, minutes: number) {
  const base = DateTime.fromISO(`${input.date}T${input.time}`, { zone: input.timezone })
  if (!base.isValid) throw new Error('La zona horaria no es válida.')

  const shifted = base.plus({ minutes })
  return {
    date: shifted.toFormat('yyyy-MM-dd'),
    time: shifted.toFormat('HH:mm'),
  }
}

function calculateAt(input: BirthInput, date: string, time: string) {
  return computeChart({
    birthdate: date,
    birthtime: time,
    timezone: input.timezone,
    location: { lat: input.lat, lng: input.lng },
  })
}

export function calculateChart(input: BirthInput): ChartData {
  const raw = calculateAt(input, input.date, input.time)
  const chart = buildChart(input, raw)

  if (input.timeAccuracy === 'approximate') {
    const before = shiftLocalTime(input, -30)
    const after = shiftLocalTime(input, 30)
    const beforeChart = buildChart(input, calculateAt(input, before.date, before.time))
    const afterChart = buildChart(input, calculateAt(input, after.date, after.time))

    const unstableFields: string[] = []
    if (
      beforeChart.summary.type !== chart.summary.type ||
      afterChart.summary.type !== chart.summary.type
    ) {
      unstableFields.push('Tipo')
    }
    if (
      beforeChart.summary.authority !== chart.summary.authority ||
      afterChart.summary.authority !== chart.summary.authority
    ) {
      unstableFields.push('Autoridad')
    }
    if (
      beforeChart.summary.profile !== chart.summary.profile ||
      afterChart.summary.profile !== chart.summary.profile
    ) {
      unstableFields.push('Perfil')
    }
    if (
      beforeChart.summary.definition !== chart.summary.definition ||
      afterChart.summary.definition !== chart.summary.definition
    ) {
      unstableFields.push('Definición')
    }
    if (
      beforeChart.centers.filter((center) => center.defined).length !==
        chart.centers.filter((center) => center.defined).length ||
      afterChart.centers.filter((center) => center.defined).length !==
        chart.centers.filter((center) => center.defined).length
    ) {
      unstableFields.push('Centros')
    }
    if (
      beforeChart.channels.filter((channel) => channel.defined).length !==
        chart.channels.filter((channel) => channel.defined).length ||
      afterChart.channels.filter((channel) => channel.defined).length !==
        chart.channels.filter((channel) => channel.defined).length
    ) {
      unstableFields.push('Canales')
    }

    chart.stability = {
      timeWindowMinutes: 30,
      unstableFields,
    }
  }

  return chart
}
