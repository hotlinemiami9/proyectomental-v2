import { birthInputSchema } from '~~/shared/validation/birth'
import { calculateChart } from '../utils/chart-engine'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = birthInputSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos de nacimiento no válidos.',
      data: parsed.error.flatten(),
    })
  }

  try {
    return calculateChart(parsed.data)
  } catch {
    throw createError({
      statusCode: 422,
      statusMessage: 'No se pudo calcular la carta con esos datos.',
    })
  }
})
