'use server'

import { Registry } from '@/registry'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const questionSchema = z.object({
  conceptId: z.string(),
  prompt: z.string().min(3),
  answerCriteria: z.string().min(3),
  type: z.enum(['text', 'multiple-choice']).default('text'),
})

export async function createQuestionAction(formData: FormData) {
  const data = {
    conceptId: formData.get('conceptId') as string,
    prompt: formData.get('prompt') as string,
    answerCriteria: formData.get('answerCriteria') as string,
    type: (formData.get('type') as 'text' | 'multiple-choice') || 'text',
  }

  const validated = questionSchema.parse(data)
  const repo = await Registry.getRepositories()

  await repo.questionRepo.create({
    ...validated,
  })

  revalidatePath(`/admin/concepts/${validated.conceptId}/edit`)
}

export async function deleteQuestionAction(id: string, conceptId: string) {
  const repo = await Registry.getRepositories()
  await repo.questionRepo.delete(id)
  revalidatePath(`/admin/concepts/${conceptId}/edit`)
}
