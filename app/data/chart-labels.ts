import type { CenterId } from '~/types/chart'

export const centerLabels: Record<CenterId, string> = {
  head: 'Cabeza',
  ajna: 'Ajna',
  throat: 'Garganta',
  g: 'G',
  heart: 'Corazón',
  sacral: 'Sacral',
  solarplexus: 'Plexo solar',
  spleen: 'Bazo',
  root: 'Raíz',
}

export const typeLabels: Record<string, string> = {
  Generator: 'Generador',
  'Manifesting Generator': 'Generador Manifestante',
  Projector: 'Proyector',
  Manifestor: 'Manifestador',
  Reflector: 'Reflector',
}

export const strategyLabels: Record<string, string> = {
  Generator: 'Esperar a responder',
  'Manifesting Generator': 'Responder e informar',
  Projector: 'Esperar la invitación',
  Manifestor: 'Informar antes de actuar',
  Reflector: 'Esperar un ciclo lunar',
}

export const authorityLabels: Record<string, string> = {
  Sacral: 'Autoridad Sacral',
  Emotional: 'Autoridad Emocional',
  Splenic: 'Autoridad Esplénica',
  Ego: 'Autoridad del Ego',
  'Self-Projected': 'Autoridad del Yo Proyectado',
  Mental: 'Autoridad Mental',
  Lunar: 'Autoridad Lunar',
  None: 'Sin autoridad interna',
}

export const definitionLabels: Record<string, string> = {
  none: 'Sin definición',
  single: 'Definición simple',
  split: 'Definición dividida',
  triple: 'Definición triple',
  quadruple: 'Definición cuádruple',
}

export const channelNames: Record<string, string> = {
  '1-8': 'Inspiración',
  '2-14': 'El Pulso',
  '3-60': 'Mutación',
  '4-63': 'Lógica',
  '5-15': 'Ritmo',
  '6-59': 'Fecundidad',
  '7-31': 'El Alfa',
  '9-52': 'Concentración',
  '10-20': 'Despertar',
  '10-34': 'Exploración',
  '10-57': 'Forma Perfeccionada',
  '11-56': 'Curiosidad',
  '12-22': 'Apertura',
  '13-33': 'El Pródigo',
  '16-48': 'La Longitud de Onda',
  '17-62': 'Aceptación',
  '18-58': 'Juicio',
  '19-49': 'Síntesis',
  '20-34': 'Carisma',
  '20-57': 'La Onda Cerebral',
  '21-45': 'Dinero',
  '23-43': 'Estructuración',
  '24-61': 'Consciencia',
  '25-51': 'Iniciación',
  '26-44': 'Entrega',
  '27-50': 'Preservación',
  '28-38': 'Lucha',
  '29-46': 'Descubrimiento',
  '30-41': 'Reconocimiento',
  '32-54': 'Transformación',
  '34-57': 'Poder',
  '35-36': 'Transitoriedad',
  '37-40': 'Comunidad',
  '39-55': 'Emoción',
  '42-53': 'Maduración',
  '47-64': 'Abstracción',
}

export function translateType(type: string) {
  return typeLabels[type] ?? type
}

export function normalizeAuthority(authority: string) {
  if (authority.startsWith('Emotional')) return 'Emotional'
  return authority
}

export function translateAuthority(authority: string) {
  return authorityLabels[normalizeAuthority(authority)] ?? authority
}

export function translateDefinition(definition: string) {
  return definitionLabels[definition] ?? definition
}

export function getStrategy(type: string) {
  return strategyLabels[type] ?? 'Escuchar tu propio proceso'
}

export function getChannelName(key: string, fallback: string | null) {
  return channelNames[key] ?? fallback ?? `Canal ${key}`
}
