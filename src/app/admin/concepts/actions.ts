'use server'

import { Registry } from '@/registry'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { conceptSchema } from '@/domain/schemas/concept.schema'

export async function createConceptAction(formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
  }

  const validatedData = conceptSchema.parse(rawData)

  await Registry.createConcept(validatedData)

  revalidatePath('/admin/concepts')
  redirect('/admin/concepts')
}

export async function updateConceptAction(id: string, formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
  }

  const validatedData = conceptSchema.parse(rawData)

  await Registry.updateConcept(id, validatedData)

  revalidatePath('/admin/concepts')
  redirect('/admin/concepts')
}

export async function deleteConceptAction(id: string) {
  await Registry.deleteConcept(id)
  revalidatePath('/admin/concepts')
}
