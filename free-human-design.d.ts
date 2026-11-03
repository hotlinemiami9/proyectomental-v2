declare module 'free-human-design' {
  export interface FreeHumanDesignInput {
    birthdate: string
    birthtime: string
    timezone: string
    location?: { lat: number; lng: number }
  }

  export interface FreeHumanDesignActivation {
    stream: 'personality' | 'design'
    body: string
    gate: number
    line: number
    color: number
    retrograde: boolean
    longitude: number
  }

  export interface FreeHumanDesignChannel {
    key: string
    gates: [number, number]
    centers: [string, string]
    name: string | null
  }

  export interface FreeHumanDesignChart {
    input: {
      birthdate: string
      birthtime: string
      timezone: string
      birth_utc: string
      location: { lat: number; lng: number; city?: string; country?: string } | null
    }
    humanDesign: {
      type: string
      authority: string
      profile: string
      definitionCount: number
      activations: {
        personality: FreeHumanDesignActivation[]
        design: FreeHumanDesignActivation[]
      }
      activatedGates: number[]
      definedChannels: FreeHumanDesignChannel[]
      definedCenters: string[]
      openCenters: string[]
      centers: Record<string, boolean>
      gateActivations: Record<number, Array<{ stream: string; body: string; line: number }>>
    }
  }

  export const CENTERS: string[]
  export const CENTER_LABELS: Record<string, string>
  export const GATE_CENTER: Record<number, string>
  export const CHANNELS: FreeHumanDesignChannel[]

  export function computeChart(input: FreeHumanDesignInput): FreeHumanDesignChart
}

declare module 'city-timezones' {
  export interface CityTimezone {
    city: string
    city_ascii: string
    lat: number
    lng: number
    pop: number
    country: string
    iso2: string
    iso3: string
    province: string
    timezone: string
  }

  export const cityMapping: CityTimezone[]
}
