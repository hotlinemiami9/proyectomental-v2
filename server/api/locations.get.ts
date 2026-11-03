import { cityMapping } from 'city-timezones'

interface SearchableCity {
  city: string
  province: string
  country: string
  lat: number
  lng: number
  timezone: string
  population: number
  search: string
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const cities: SearchableCity[] = cityMapping.map((city) => ({
  city: city.city,
  province: city.province,
  country: city.country,
  lat: city.lat,
  lng: city.lng,
  timezone: city.timezone,
  population: city.pop,
  search: normalize(`${city.city} ${city.city_ascii} ${city.province} ${city.country}`),
}))

export default defineEventHandler((event) => {
  const query = String(getQuery(event).q ?? '').trim()
  if (query.length < 2) return { results: [] }

  const needle = normalize(query)
  const results = cities
    .filter((city) => city.search.includes(needle))
    .sort((a, b) => b.population - a.population)
    .slice(0, 8)
    .map((city) => ({
      id: `${city.city}-${city.lat}-${city.lng}`,
      city: city.city,
      province: city.province,
      country: city.country,
      lat: city.lat,
      lng: city.lng,
      timezone: city.timezone,
    }))

  return { results }
})
