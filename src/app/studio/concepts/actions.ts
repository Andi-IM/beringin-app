'use server'

import { Registry } from '@/registry'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { conceptSchema } from '@/domain/schemas/concept.schema'

import { createClient } from '@/infrastructure/auth/supabase-client'

export async function createConceptAction(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    userId: user.id, // Inject userId
  }

  const validatedData = conceptSchema.parse(rawData)

  // Ensure userId is present (it's optional in schema but required for creation)
  if (!validatedData.userId) {
    validatedData.userId = user.id
  }

  // We need to cast or reconstruct to match CreateConceptData which requires userId string
  const createData = {
    ...validatedData,
    userId: validatedData.userId!,
  }

  await Registry.createConcept(createData)

  revalidatePath('/studio/concepts') // Updated path
  redirect('/studio/concepts') // Updated path
}

export async function updateConceptAction(id: string, formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
  }

  const validatedData = conceptSchema.parse(rawData)

  await Registry.updateConcept(id, validatedData)

  revalidatePath('/studio/concepts')
  redirect('/studio/concepts')
}

export async function deleteConceptAction(id: string) {
  await Registry.deleteConcept(id)
  revalidatePath('/studio/concepts')
}
