import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    guides: defineCollection({
      type: 'page',
      source: 'guides/**/*.md',
      schema: z.object({
        draft: z.boolean().default(false),
        reviewed: z.boolean().default(false),
      }),
    }),
  },
})
