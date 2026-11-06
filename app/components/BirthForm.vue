<script setup lang="ts">
import { useChartsStore } from '~/stores/charts'
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

const store = useChartsStore()
const hydrated = ref(false)
const locationQuery = ref('')
const locationResults = ref<LocationResult[]>([])
const selectedLocation = ref<LocationResult | null>(null)
const searching = ref(false)
const searchCompleted = ref(false)
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
    searchCompleted.value = false
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
    if (request === searchRequest) {
      searching.value = false
      searchCompleted.value = true
    }
  }
}

watch(locationQuery, (query) => {
  if (query.length > 0) selectedLocation.value = null
  errors.city = ''
  searchCompleted.value = false
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => void searchLocations(query), 250)
})

function selectLocation(location: LocationResult) {
  selectedLocation.value = location
  errors.city = ''
  locationResults.value = []
  searchCompleted.value = false
  locationQuery.value = ''
}

function clearLocation() {
  selectedLocation.value = null
  locationQuery.value = ''
  searchCompleted.value = false
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
  <section class="lg:border-l lg:border-white/10 lg:pl-10" :data-hydrated="hydrated">
    <div class="max-w-xl">
      <p class="text-[11px] tracking-[0.24em] text-gold-300 uppercase">Tu carta</p>
      <h2 class="mt-2 font-serif text-4xl">Datos de nacimiento</h2>
      <p class="mt-3 text-sm leading-relaxed text-moon-300">
        Todo en un solo paso. Sin registro y sin guardar nada en la nube.
      </p>
    </div>

    <form class="mt-8 max-w-xl space-y-7" novalidate @submit.prevent="submit">
      <div class="relative">
        <label for="birth-name" class="text-[11px] tracking-[0.18em] text-moon-500 uppercase">
          Nombre
        </label>
        <input
          id="birth-name"
          v-model="form.name"
          class="mt-2 block w-full border-b border-white/25 bg-transparent pb-2 text-lg text-moon-100 outline-none focus:border-gold-300"
          type="text"
          maxlength="80"
          autocomplete="name"
          placeholder="Cómo aparecerá en la carta"
          :aria-invalid="Boolean(errors.name)"
          :aria-describedby="errors.name ? 'name-error' : undefined"
        />
        <p
          id="name-error"
          class="pointer-events-none absolute inset-x-0 top-full mt-1 text-xs leading-4 text-red-300"
          aria-live="polite"
        >
          {{ errors.name }}
        </p>
      </div>

      <div class="grid gap-7 sm:grid-cols-2">
        <div class="relative">
          <label for="birth-date" class="text-[11px] tracking-[0.18em] text-moon-500 uppercase">
            Fecha de nacimiento
          </label>
          <input
            id="birth-date"
            :value="form.birthDate"
            class="mt-2 block w-full border-b border-white/25 bg-transparent pb-2 text-lg text-moon-100 tabular-nums outline-none focus:border-gold-300"
            type="text"
            inputmode="numeric"
            maxlength="10"
            autocomplete="off"
            placeholder="DD/MM/AAAA"
            :aria-invalid="Boolean(errors.date)"
            :aria-describedby="errors.date ? 'date-error' : undefined"
            @input="onDateInput"
          />
          <p
            id="date-error"
            class="pointer-events-none absolute inset-x-0 top-full mt-1 text-xs leading-4 text-red-300"
            aria-live="polite"
          >
            {{ errors.date }}
          </p>
        </div>

        <div class="relative">
          <label
            for="birth-time"
            class="text-[10px] tracking-[0.14em] whitespace-nowrap text-moon-500 uppercase"
          >
            Hora de nacimiento · 24 h
          </label>
          <input
            id="birth-time"
            :value="form.birthTime"
            class="mt-2 block w-full border-b border-white/25 bg-transparent pb-2 text-lg text-moon-100 tabular-nums outline-none focus:border-gold-300"
            type="text"
            inputmode="numeric"
            maxlength="5"
            autocomplete="off"
            placeholder="HH:MM"
            :aria-describedby="errors.time ? 'exact-time-help time-error' : 'exact-time-help'"
            :aria-invalid="Boolean(errors.time)"
            @input="onTimeInput"
          />
          <p
            id="time-error"
            class="pointer-events-none absolute inset-x-0 top-full mt-1 text-xs leading-4 text-red-300"
            aria-live="polite"
          >
            {{ errors.time }}
          </p>
        </div>
      </div>

      <p
        id="exact-time-help"
        class="border-l border-gold-300/40 pl-3 text-xs leading-relaxed text-moon-500"
      >
        La hora debe ser exacta: unos minutos pueden cambiar el tipo, la autoridad o el perfil de la
        carta.
      </p>

      <div>
        <div v-if="selectedLocation" class="border-l border-gold-300/40 pl-4">
          <p class="text-[11px] tracking-[0.18em] text-gold-300 uppercase">Lugar seleccionado</p>
          <p class="mt-2 text-lg">{{ selectedLabel }}</p>
          <p class="mt-1 text-xs text-moon-500">Zona horaria detectada automáticamente.</p>
          <button
            type="button"
            class="mt-3 text-sm text-gold-300 underline-offset-4 hover:underline"
            @click="clearLocation"
          >
            Cambiar lugar
          </button>
        </div>

        <div v-else class="relative">
          <label for="birth-city" class="text-[11px] tracking-[0.18em] text-moon-500 uppercase">
            Ciudad de nacimiento
          </label>
          <div class="relative">
            <input
              id="birth-city"
              v-model="locationQuery"
              class="mt-2 block w-full border-b border-white/25 bg-transparent pb-2 text-lg text-moon-100 outline-none focus:border-gold-300"
              type="search"
              autocomplete="off"
              placeholder="Busca un municipio"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="city-results"
              :aria-expanded="
                locationQuery.length >= 2 &&
                (searching || locationResults.length > 0 || searchCompleted)
              "
              :aria-describedby="errors.city ? 'city-help city-error' : 'city-help'"
              :aria-invalid="Boolean(errors.city)"
            />
            <div
              v-if="
                locationQuery.length >= 2 &&
                (searching || locationResults.length > 0 || searchCompleted)
              "
              id="city-results"
              class="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-white/15 bg-night-950/95 shadow-2xl shadow-black/50 backdrop-blur-md"
              role="listbox"
              aria-label="Localidades encontradas"
            >
              <p v-if="searching" class="px-3 py-2.5 text-sm text-moon-300" aria-live="polite">
                Buscando…
              </p>
              <ul
                v-else-if="locationResults.length"
                class="max-h-64 divide-y divide-white/5 overflow-y-auto"
              >
                <li v-for="location in locationResults" :key="location.id">
                  <button
                    type="button"
                    class="w-full px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/5 hover:text-gold-300"
                    role="option"
                    @click="selectLocation(location)"
                  >
                    <span class="text-moon-100">{{ location.city }}</span>
                    <span class="text-moon-500">
                      · {{ [location.province, location.country].filter(Boolean).join(', ') }}</span
                    >
                  </button>
                </li>
              </ul>
              <p v-else class="px-3 py-2.5 text-sm text-moon-500">
                No encontramos esa localidad. Prueba con el nombre oficial o el municipio cercano.
              </p>
            </div>
          </div>
          <p id="city-help" class="mt-2 text-xs text-moon-500">
            Más de 135.000 localidades. Escribe el nombre oficial o el municipio más cercano.
          </p>
          <p
            id="city-error"
            class="pointer-events-none absolute inset-x-0 top-full mt-1 text-xs leading-4 text-red-300"
            aria-live="polite"
          >
            {{ errors.city }}
          </p>
        </div>
      </div>

      <div class="relative">
        <p
          v-if="serverError"
          class="absolute bottom-full left-0 mb-3 rounded-lg border-l-2 border-red-400 bg-night-950/90 px-3 py-2 text-sm text-red-200 shadow-lg shadow-black/30"
          role="alert"
        >
          {{ serverError }}
        </p>
        <button
          type="submit"
          class="w-full rounded-full bg-gold-300 px-5 py-3 text-sm font-medium text-night-950 transition-colors hover:bg-gold-300/90 disabled:opacity-60 sm:w-auto"
          :disabled="submitting"
        >
          {{ submitting ? 'Calculando…' : 'Calcular mi carta' }}
        </button>
      </div>
    </form>
  </section>
</template>
