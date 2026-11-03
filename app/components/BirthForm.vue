<script setup lang="ts">
import { useChartsStore } from '~/stores/charts'
import type { ChartData, TimeAccuracy } from '~/types/chart'

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
const step = ref(1)
const locationQuery = ref('')
const locationResults = ref<LocationResult[]>([])
const selectedLocation = ref<LocationResult | null>(null)
const searching = ref(false)
const submitting = ref(false)
const serverError = ref('')

const form = reactive({
  name: '',
  date: '',
  time: '',
  timeAccuracy: 'exact' as TimeAccuracy,
})

const errors = reactive<Record<string, string>>({})
let searchTimer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  hydrated.value = true
})

const today = new Date().toISOString().slice(0, 10)

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

function validateStepOne() {
  errors.name = form.name.trim() ? '' : 'Escribe el nombre que aparecerá en la carta.'
  errors.date = form.date ? '' : 'Indica la fecha de nacimiento.'
  if (form.date && form.date > today) errors.date = 'La fecha no puede ser futura.'
  if (form.date && form.date < '1900-01-01') errors.date = 'La fecha debe ser posterior a 1900.'
  errors.time = form.time ? '' : 'Indica la hora de nacimiento.'
  return !errors.name && !errors.date && !errors.time
}

async function searchLocations(query: string) {
  if (query.trim().length < 2) {
    locationResults.value = []
    return
  }

  searching.value = true
  try {
    const response = await $fetch<{ results: LocationResult[] }>('/api/locations', {
      query: { q: query },
    })
    locationResults.value = response.results
  } catch {
    locationResults.value = []
  } finally {
    searching.value = false
  }
}

watch(locationQuery, (query) => {
  if (query.length > 0) selectedLocation.value = null
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => void searchLocations(query), 250)
})

function selectLocation(location: LocationResult) {
  selectedLocation.value = location
  locationResults.value = []
  locationQuery.value = ''
}

function clearLocation() {
  selectedLocation.value = null
  locationQuery.value = ''
}

function nextStep() {
  if (step.value === 1 && !validateStepOne()) return
  if (step.value === 2 && !selectedLocation.value) {
    serverError.value = 'Selecciona una ciudad de la lista para continuar.'
    return
  }
  serverError.value = ''
  step.value = Math.min(3, step.value + 1)
}

function previousStep() {
  serverError.value = ''
  step.value = Math.max(1, step.value - 1)
}

async function submit() {
  if (!selectedLocation.value || !validateStepOne()) return

  submitting.value = true
  serverError.value = ''

  try {
    const chart = await $fetch<ChartData>('/api/chart', {
      method: 'POST',
      body: {
        name: form.name.trim(),
        date: form.date,
        time: form.time,
        timeAccuracy: form.timeAccuracy,
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
    class="rounded-[1.8rem] border border-white/10 bg-night-900/80 p-5 shadow-2xl backdrop-blur-md sm:p-7"
    :data-hydrated="hydrated"
  >
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[11px] tracking-[0.24em] text-gold-300 uppercase">Tu carta</p>
        <h2 class="mt-1 font-serif text-3xl">Datos de nacimiento</h2>
      </div>
      <UBadge color="neutral" variant="outline">Paso {{ step }} de 3</UBadge>
    </div>

    <ol
      class="mt-6 grid grid-cols-3 gap-2 text-[11px] text-moon-500"
      aria-label="Pasos del formulario"
    >
      <li :class="step >= 1 ? 'text-gold-300' : ''">01 · Datos</li>
      <li :class="step >= 2 ? 'text-gold-300' : ''">02 · Lugar</li>
      <li :class="step >= 3 ? 'text-gold-300' : ''">03 · Revisión</li>
    </ol>

    <form class="mt-6" novalidate @submit.prevent="submit">
      <div v-if="step === 1" class="space-y-5">
        <div>
          <label for="birth-name" class="text-[11px] tracking-[0.18em] text-moon-500 uppercase"
            >Nombre</label
          >
          <input
            id="birth-name"
            v-model="form.name"
            class="mt-2 w-full border-b border-white/25 bg-transparent pb-2 text-lg text-moon-100 outline-none focus:border-gold-300"
            type="text"
            maxlength="80"
            autocomplete="name"
            placeholder="Cómo aparecerá en la carta"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-300">{{ errors.name }}</p>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label for="birth-date" class="text-[11px] tracking-[0.18em] text-moon-500 uppercase"
              >Fecha</label
            >
            <input
              id="birth-date"
              v-model="form.date"
              class="mt-2 w-full border-b border-white/25 bg-transparent pb-2 text-lg text-moon-100 outline-none focus:border-gold-300"
              type="date"
              min="1900-01-01"
              :max="today"
            />
            <p v-if="errors.date" class="mt-1 text-xs text-red-300">{{ errors.date }}</p>
          </div>
          <div>
            <label for="birth-time" class="text-[11px] tracking-[0.18em] text-moon-500 uppercase"
              >Hora</label
            >
            <input
              id="birth-time"
              v-model="form.time"
              class="mt-2 w-full border-b border-white/25 bg-transparent pb-2 text-lg text-moon-100 outline-none focus:border-gold-300"
              type="time"
            />
            <p v-if="errors.time" class="mt-1 text-xs text-red-300">{{ errors.time }}</p>
          </div>
        </div>

        <fieldset>
          <legend class="text-[11px] tracking-[0.18em] text-moon-500 uppercase">
            Precisión de la hora
          </legend>
          <div class="mt-3 flex flex-wrap gap-2">
            <label class="cursor-pointer rounded-full border border-white/15 px-3 py-1.5 text-sm">
              <input v-model="form.timeAccuracy" class="sr-only" type="radio" value="exact" />
              <span :class="form.timeAccuracy === 'exact' ? 'text-gold-300' : 'text-moon-300'"
                >Exacta</span
              >
            </label>
            <label class="cursor-pointer rounded-full border border-white/15 px-3 py-1.5 text-sm">
              <input v-model="form.timeAccuracy" class="sr-only" type="radio" value="approximate" />
              <span
                :class="form.timeAccuracy === 'approximate' ? 'text-gold-300' : 'text-moon-300'"
              >
                Aproximada
              </span>
            </label>
          </div>
        </fieldset>
      </div>

      <div v-else-if="step === 2" class="space-y-4">
        <div
          v-if="selectedLocation"
          class="rounded-2xl border border-gold-300/30 bg-gold-300/5 p-4"
        >
          <p class="text-[11px] tracking-[0.18em] text-gold-300 uppercase">Lugar seleccionado</p>
          <p class="mt-2 text-lg">{{ selectedLabel }}</p>
          <p class="mt-1 text-xs text-moon-500">Zona horaria: {{ selectedLocation.timezone }}</p>
          <button
            type="button"
            class="mt-3 text-sm text-gold-300 underline-offset-4 hover:underline"
            @click="clearLocation"
          >
            Cambiar lugar
          </button>
        </div>

        <div v-else>
          <label for="birth-city" class="text-[11px] tracking-[0.18em] text-moon-500 uppercase"
            >Ciudad de nacimiento</label
          >
          <input
            id="birth-city"
            v-model="locationQuery"
            class="mt-2 w-full border-b border-white/25 bg-transparent pb-2 text-lg text-moon-100 outline-none focus:border-gold-300"
            type="search"
            autocomplete="off"
            placeholder="Busca una ciudad"
            aria-describedby="city-help"
          />
          <p id="city-help" class="mt-2 text-xs text-moon-500">
            Buscaremos el lugar y su zona horaria histórica.
          </p>
          <p v-if="searching" class="mt-3 text-sm text-moon-300" aria-live="polite">Buscando…</p>
          <ul v-else-if="locationResults.length" class="mt-3 space-y-1">
            <li v-for="location in locationResults" :key="location.id">
              <button
                type="button"
                class="w-full rounded-xl border border-white/10 px-3 py-2 text-left text-sm transition-colors hover:border-gold-300/50 hover:bg-white/5"
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
            No encontramos esa ciudad. Prueba con otro nombre.
          </p>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <dl class="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-moon-500">Nombre</dt>
              <dd class="mt-1">{{ form.name }}</dd>
            </div>
            <div>
              <dt class="text-moon-500">Fecha y hora</dt>
              <dd class="mt-1">{{ form.date }} · {{ form.time }}</dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-moon-500">Lugar</dt>
              <dd class="mt-1">{{ selectedLabel }}</dd>
            </div>
          </dl>
          <p
            v-if="form.timeAccuracy === 'approximate'"
            class="mt-4 text-sm leading-relaxed text-gold-300"
          >
            Has indicado una hora aproximada. Calcularemos la carta y marcaremos qué datos pueden
            variar en un margen de 30 minutos.
          </p>
        </div>
      </div>

      <p
        v-if="serverError"
        class="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"
        role="alert"
      >
        {{ serverError }}
      </p>

      <div class="mt-7 flex flex-wrap items-center justify-between gap-3">
        <button
          v-if="step > 1"
          type="button"
          class="rounded-full px-4 py-2 text-sm text-moon-300 transition-colors hover:text-moon-100"
          @click="previousStep"
        >
          Atrás
        </button>
        <span v-else />
        <button
          v-if="step < 3"
          type="button"
          class="rounded-full bg-aurora-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-aurora-300 hover:text-night-950"
          @click="nextStep"
        >
          Continuar
        </button>
        <button
          v-else
          type="submit"
          class="rounded-full bg-aurora-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-aurora-300 hover:text-night-950 disabled:opacity-60"
          :disabled="submitting"
        >
          {{ submitting ? 'Calculando…' : 'Calcular mi carta' }}
        </button>
      </div>
    </form>
  </section>
</template>
