export type CenterId =
  'head' | 'ajna' | 'throat' | 'g' | 'heart' | 'sacral' | 'solarplexus' | 'spleen' | 'root'

export interface BirthInput {
  name: string
  date: string
  time: string
  city: string
  country: string
  lat: number
  lng: number
  timezone: string
}

export interface ChartSummary {
  type: string
  typeLabel: string
  strategy: string
  strategyLabel: string
  authority: string
  authorityLabel: string
  profile: string
  definition: string
  definitionLabel: string
}

export interface ChartCenter {
  id: CenterId
  label: string
  defined: boolean
}

export interface ChartChannel {
  key: string
  name: string | null
  gates: [number, number]
  centers: [CenterId, CenterId]
  defined: boolean
}

export interface ChartGate {
  gate: number
  center: CenterId
  personality: number[]
  design: number[]
}

export interface ChartActivation {
  body: string
  gate: number
  line: number
  color: number
  retrograde: boolean
}

export interface ChartData {
  input: BirthInput & {
    birthUtc: string
  }
  summary: ChartSummary
  centers: ChartCenter[]
  channels: ChartChannel[]
  gates: ChartGate[]
  activations: {
    personality: ChartActivation[]
    design: ChartActivation[]
  }
}

export interface SavedChart {
  id: string
  createdAt: string
  updatedAt: string
  chart: ChartData
}
