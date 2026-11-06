import allCities from 'all-the-cities'
import tzLookup from 'tz-lookup'

interface SearchableCity {
  id: string
  city: string
  province: string
  country: string
  lat: number
  lng: number
  population: number
  normalizedName: string
  search: string
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const regionNames = new Intl.DisplayNames(['es'], { type: 'region' })

function countryName(code: string) {
  if (!code) return ''
  try {
    return regionNames.of(code) ?? code
  } catch {
    return code
  }
}

function timezoneFor(lat: number, lng: number) {
  try {
    return tzLookup(lat, lng)
  } catch {
    return 'UTC'
  }
}

const cities: SearchableCity[] = allCities.map((city) => {
  const [lng, lat] = city.loc.coordinates
  const province = /^[A-Z]{2,3}$/.test(city.adminCode) ? city.adminCode : ''

  return {
    id: String(city.cityId),
    city: city.name,
    province,
    country: countryName(city.country),
    lat,
    lng,
    population: city.population,
    normalizedName: normalize(city.name),
    search: normalize(
      `${city.name} ${city.altName} ${city.adminCode} ${countryName(city.country)}`,
    ),
  }
})

function matchRank(city: SearchableCity, needle: string) {
  if (city.normalizedName === needle) return 0
  if (city.normalizedName.startsWith(needle)) return 1
  if (city.normalizedName.split(/\s+/).some((word) => word.startsWith(needle))) return 2
  return 3
}

export default defineEventHandler((event) => {
  const query = String(getQuery(event).q ?? '')
    .trim()
    .slice(0, 80)

  if (query.length < 2) return { results: [] }

  const needle = normalize(query)
  const results = cities
    .filter((city) => city.search.includes(needle))
    .map((city) => ({ city, rank: matchRank(city, needle) }))
    .sort(
      (a, b) =>
        a.rank - b.rank ||
        b.city.population - a.city.population ||
        a.city.city.localeCompare(b.city.city, 'es'),
    )
    .slice(0, 12)
    .map(({ city }) => ({
      id: city.id,
      city: city.city,
      province: city.province,
      country: city.country,
      lat: city.lat,
      lng: city.lng,
      timezone: timezoneFor(city.lat, city.lng),
    }))

  return { results }
})
