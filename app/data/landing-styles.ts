export type StarfieldVariant = 'midnight' | 'violet' | 'gold' | 'ice'
export type LandingFormVariant = 'embedded' | 'glass' | 'editorial' | 'minimal'

export interface LandingStyle {
  id: string
  label: string
  note: string
  sky: StarfieldVariant
  form: LandingFormVariant
  fontDisplay: string
  fontInterface: string
  accent: string
  accentContrast: string
}

export const landingStyles: LandingStyle[] = [
  {
    id: 'nocturno',
    label: 'Nocturno',
    note: 'Serif editorial, cielo frío y formulario incrustado.',
    sky: 'midnight',
    form: 'embedded',
    fontDisplay: '"Fraunces Variable", Georgia, Cambria, serif',
    fontInterface: '"Manrope Variable", ui-sans-serif, system-ui, sans-serif',
    accent: '#f2d48f',
    accentContrast: '#1b160b',
  },
  {
    id: 'aurora',
    label: 'Aurora',
    note: 'Luz violeta, tipografía redondeada y panel de cristal.',
    sky: 'violet',
    form: 'glass',
    fontDisplay: '"Fraunces Variable", Georgia, Cambria, serif',
    fontInterface: 'ui-rounded, "Trebuchet MS", sans-serif',
    accent: '#c4b5fd',
    accentContrast: '#1a1036',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    note: 'Cielo dorado, aire tipográfico clásico y formulario de línea.',
    sky: 'gold',
    form: 'editorial',
    fontDisplay: 'Georgia, "Times New Roman", Times, serif',
    fontInterface: 'Georgia, "Times New Roman", Times, serif',
    accent: '#e9c889',
    accentContrast: '#21170c',
  },
  {
    id: 'eclipse',
    label: 'Eclipse',
    note: 'Estrellas glaciales, titulares monoespaciados y formulario mínimo.',
    sky: 'ice',
    form: 'minimal',
    fontDisplay: 'ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace',
    fontInterface: 'ui-sans-serif, system-ui, sans-serif',
    accent: '#8ee6ff',
    accentContrast: '#04121a',
  },
]
