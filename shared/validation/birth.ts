import { z } from 'zod'

export const birthInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio.')
    .max(80, 'El nombre es demasiado largo.'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha no es válida.')
    .refine((value) => value >= '1900-01-01', 'La fecha debe ser posterior a 1900.')
    .refine(
      (value) => value <= new Date().toISOString().slice(0, 10),
      'La fecha no puede ser futura.',
    ),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'La hora no es válida.'),
  city: z.string().trim().min(2, 'La ciudad es obligatoria.').max(100),
  country: z.string().trim().min(2, 'El país es obligatorio.').max(100),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  timezone: z.string().trim().min(1, 'La zona horaria es obligatoria.').max(64),
})

export type BirthInput = z.infer<typeof birthInputSchema>
