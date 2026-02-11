import { z } from 'zod'

export const conceptSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
})

export type ConceptFormData = z.infer<typeof conceptSchema>
