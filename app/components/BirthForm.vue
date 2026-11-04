<script setup lang="ts">
import { useChartsStore } from '~/stores/charts'
import type { LandingFormVariant } from '~/data/landing-styles'
import type { ChartData } from '~/types/chart'

interface LocationResult {
  id: string
  city: string
  province: string
  country: string
  lat: number
  lng: number
  timezone: string
}

const props = defineProps<{ variant?: LandingFormVariant }>()
const store = useChartsStore()
const hydrated = ref(false)
const locationQuery = ref('')
const locationResults = ref<LocationResult[]>([])
const selectedLocation = ref<LocationResult | null>(null)
const searching = ref(false)
const submitting = ref(false)
const serverError = ref('')

const form = reactive({
  name: '',
  birthDate: '',
  birthTime: '',
})

const errors = reactive<Record<string, string>>({})
let searchTimer: ReturnType<typeof setTimeout> | undefined
let searchRequest = 0

onMounted(() => {
  hydrated.value = true
})

const todayIso = new Date().toISOString().slice(0, 10)

const sectionClass = computed(() => {
  switch (props.variant ?? 'embedded') {
    case 'glass':
      return 'rounded-[2rem] border border-white/15 bg-white/[0.06] p-6 backdrop-blur-xl'
    case 'editorial':
      return 'border-t border-white/15 pt-6'
    case 'minimal':
      return 'max-w-xl'
    case 'embedded':
    default:
      return 'lg:border-l lg:border-white/10 lg:pl-10'
  }
})

const selectedLabel = computed(() => {
  if (!selectedLocation.value) return ''
  return [
    selectedLocation.value.city,
    selectedLocation.value.province,
    selectedLocation.value.country,
  ]
    .filter(Boolean)
    .join(', ')
})

function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

function formatTimeInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}:${digits.slice(2)}`
}

function onDateInput(event: Event) {
  const input = event.target as HTMLInputElement
  form.birthDate = formatDateInput(input.value)
  input.value = form.birthDate
  errors.date = ''
}

function onTimeInput(event: Event) {
  const input = event.target as HTMLInputElement
  form.birthTime = formatTimeInput(input.value)
  input.value = form.birthTime
  errors.time = ''
}

function parseSpanishDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) return null

  const [, dayRaw = '', monthRaw = '', yearRaw = ''] = match
  const day = Number(dayRaw)
  const month = Number(monthRaw)
  const year = Number(yearRaw)
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  return `${yearRaw}-${monthRaw}-${dayRaw}`
}

function validateForm() {
  errors.name = form.name.trim() ? '' : 'Escribe el nombre que aparecerá en la carta.'

  const date = parseSpanishDate(form.birthDate)
  errors.date = ''
  if (!form.birthDate) errors.date = 'Indica tu fecha de nacimiento.'
  else if (!date) errors.date = 'Usa el formato DD/MM/AAAA.'
  else if (date < '1900-01-01') errors.date = 'La fecha debe ser posterior a 1900.'
  else if (date > todayIso) errors.date = 'La fecha no puede ser futura.'

  errors.time = ''
  if (!form.birthTime) errors.time = 'Indica tu hora de nacimiento.'
  else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(form.birthTime)) {
    errors.time = 'Usa el formato de 24 horas HH:MM.'
  }

  errors.city = selectedLocation.value ? '' : 'Selecciona una ciudad de la lista.'

  const valid = !errors.name && !errors.date && !errors.time && !errors.city
  if (!valid) {
    void nextTick(() => {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    })
  }

  return { valid, date }
}

async function searchLocations(query: string) {
  if (query.trim().length < 2) {
    locationResults.value = []
    return
  }

  const request = ++searchRequest
  searching.value = true

  try {
    const response = await $fetch<{ results: LocationResult[] }>('/api/locations', {
      query: { q: query },
    })
    if (request === searchRequest) locationResults.value = response.results
  } catch {
    if (request === searchRequest) locationResults.value = []
  } finally {
    if (request === searchRequest) searching.value = false
  }
}

watch(locationQuery, (query) => {
  if (query.length > 0) selectedLocation.value = null
  errors.city = ''
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => void searchLocations(query), 250)
})

function selectLocation(location: LocationResult) {
  selectedLocation.value = location
  errors.city = ''
  locationResults.value = []
  locationQuery.value = ''
}

function clearLocation() {
  selectedLocation.value = null
  locationQuery.value = ''
}

async function submit() {
  const validation = validateForm()
  if (!validation.valid || !validation.date || !selectedLocation.value) return

  submitting.value = true
  serverError.value = ''

  try {
    const chart = await $fetch<ChartData>('/api/chart', {
      method: 'POST',
      body: {
        name: form.name.trim(),
        date: validation.date,
        time: form.birthTime,
        city: selectedLocation.value.city,
        country: selectedLocation.value.country,
        lat: selectedLocation.value.lat,
        lng: selectedLocation.value.lng,
        timezone: selectedLocation.value.timezone,
      },
    })

    const saved = store.save(chart)
    await navigateTo(`/carta/${saved.id}`)
  } catch (error) {
    const fetchError = error as { data?: { statusMessage?: string; message?: string } }
    serverError.value =
      fetchError.data?.statusMessage ?? fetchError.data?.message ?? 'No se pudo calcular la carta.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section
    :class="sectionClass"
    :data-hydrated="hydrated"
    :data-form-variant="variant ?? 'embedded'"
  >
    <div class="max-w-xl">
      <p class="style-accent text-[11px] tracking-[0.24em] uppercase">Tu carta</p>
      <h2 class="style-heading mt-2 text-4xl">Datos de nacimiento</h2>
      <p class="mt-3 text-sm leading-relaxed text-moon-300">
        Todo en un solo paso. Sin registro y sin guardar nada en la nube.
      </p>
    </div>

    <form class="mt-8 max-w-xl space-y-7" novalidate @submit.prevent="submit">
      <div>
        <label for="birth-name" class="text-[11px] tracking-[0.18em] text-moon-500 uppercase">
          Nombre
        </label>
        <input
          id="birth-name"
          v-model="form.name"
          class="style-input mt-2 w-full border-b bg-transparent pb-2 text-lg text-moon-100 outline-none"
          type="text"
          maxlength="80"
          autocomplete="name"
          placeholder="Cómo aparecerá en la carta"
          :aria-invalid="Boolean(errors.name)"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-300">{{ errors.name }}</p>
      </div>

      <div class="grid gap-7 sm:grid-cols-2">
        <div>
          <label for="birth-date" class="text-[11px] tracking-[0.18em] text-moon-500 uppercase">
            Fecha de nacimiento
          </label>
          <input
            id="birth-date"
            :value="form.birthDate"
            class="style-input mt-2 w-full border-b bg-transparent pb-2 text-lg text-moon-100 outline-none"
            type="text"
            inputmode="numeric"
            maxlength="10"
            autocomplete="off"
            placeholder="DD/MM/AAAA"
            :aria-invalid="Boolean(errors.date)"
            @input="onDateInput"
          />
          <p v-if="errors.date" class="mt-1 text-xs text-red-300">{{ errors.date }}</p>
        </div>

        <div>
          <label
            for="birth-time"
            class="text-[10px] tracking-[0.14em] whitespace-nowrap text-moon-500 uppercase"
          >
            Hora de nacimiento · 24 h
          </label>
          <input
            id="birth-time"
            :value="form.birthTime"
            class="style-input mt-2 w-full border-b bg-transparent pb-2 text-lg text-moon-100 outline-none"
            type="text"
            inputmode="numeric"
            maxlength="5"
            autocomplete="off"
            placeholder="HH:MM"
            aria-describedby="exact-time-help"
            :aria-invalid="Boolean(errors.time)"
            @input="onTimeInput"
          />
          <p v-if="errors.time" class="mt-1 text-xs text-red-300">{{ errors.time }}</p>
        </div>
      </div>

      <p
        id="exact-time-help"
        class="style-accent-border border-l pl-3 text-xs leading-relaxed text-moon-500"
      >
        La hora debe ser exacta: unos minutos pueden cambiar el tipo, la autoridad o el perfil de la
        carta.
      </p>

      <div>
        <div v-if="selectedLocation" class="style-accent-border border-l pl-4">
          <p class="style-accent text-[11px] tracking-[0.18em] uppercase">Lugar seleccionado</p>
          <p class="mt-2 text-lg">{{ selectedLabel }}</p>
          <p class="mt-1 text-xs text-moon-500">Zona horaria detectada automáticamente.</p>
          <button
            type="button"
            class="style-accent mt-3 text-sm underline-offset-4 hover:underline"
            @click="clearLocation"
          >
            Cambiar lugar
          </button>
        </div>

        <div v-else>
          <label for="birth-city" class="text-[11px] tracking-[0.18em] text-moon-500 uppercase">
            Ciudad de nacimiento
          </label>
          <input
            id="birth-city"
            v-model="locationQuery"
            class="style-input mt-2 w-full border-b bg-transparent pb-2 text-lg text-moon-100 outline-none"
            type="search"
            autocomplete="off"
            placeholder="Busca un municipio"
            aria-describedby="city-help"
            :aria-invalid="Boolean(errors.city)"
          />
          <p id="city-help" class="mt-2 text-xs text-moon-500">
            Más de 135.000 localidades. Escribe el nombre oficial o el municipio más cercano.
          </p>
          <p v-if="errors.city" class="mt-1 text-xs text-red-300">{{ errors.city }}</p>
          <p v-if="searching" class="mt-3 text-sm text-moon-300" aria-live="polite">Buscando…</p>
          <ul v-else-if="locationResults.length" class="mt-3 space-y-1">
            <li v-for="location in locationResults" :key="location.id">
              <button
                type="button"
                class="style-result w-full border-b px-1 py-2.5 text-left text-sm transition-colors"
                @click="selectLocation(location)"
              >
                <span class="text-moon-100">{{ location.city }}</span>
                <span class="text-moon-500">
                  · {{ [location.province, location.country].filter(Boolean).join(', ') }}</span
                >
              </button>
            </li>
          </ul>
          <p v-else-if="locationQuery.length >= 2" class="mt-3 text-sm text-moon-500">
            No encontramos esa localidad. Prueba con el nombre oficial o el municipio cercano.
          </p>
        </div>
      </div>

      <p
        v-if="serverError"
        class="border-l-2 border-red-400 pl-3 text-sm text-red-200"
        role="alert"
      >
        {{ serverError }}
      </p>

      <button
        type="submit"
        class="style-button w-full rounded-full px-5 py-3 text-sm font-medium transition-colors disabled:opacity-60 sm:w-auto"
        :disabled="submitting"
      >
        {{ submitting ? 'Calculando…' : 'Calcular mi carta' }}
      </button>
    </form>
  </section>
</template>
