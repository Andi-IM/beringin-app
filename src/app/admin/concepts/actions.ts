'use server'

import { Registry } from '@/registry'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createConceptAction(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string

  if (!title || !description || !category) {
    throw new Error('Missing required fields')
  }

  await Registry.createConcept({
    title,
    description,
    category,
  })

  revalidatePath('/admin/concepts')
  redirect('/admin/concepts')
}

export async function updateConceptAction(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string

  await Registry.updateConcept(id, {
    title,
    description,
    category,
  })

  revalidatePath('/admin/concepts')
  redirect('/admin/concepts')
}

export async function deleteConceptAction(id: string) {
  await Registry.deleteConcept(id)
  revalidatePath('/admin/concepts')
}
