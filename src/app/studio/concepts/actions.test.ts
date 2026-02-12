import {
  createConceptAction,
  updateConceptAction,
  deleteConceptAction,
} from './actions'
import { Registry } from '@/registry'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Mock dependencies
jest.mock('@/registry', () => ({
  Registry: {
    createConcept: jest.fn(),
    updateConcept: jest.fn(),
    deleteConcept: jest.fn(),
  },
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('Concept Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createConceptAction', () => {
    it('should create concept and redirect on success', async () => {
      const formData = new FormData()
      formData.append('title', 'Test Concept')
      formData.append('description', 'Test Description Long Enough')
      formData.append('category', 'Test Category')

      await createConceptAction(formData)

      expect(Registry.createConcept).toHaveBeenCalledWith({
        title: 'Test Concept',
        description: 'Test Description Long Enough',
        category: 'Test Category',
      })
      expect(revalidatePath).toHaveBeenCalledWith('/admin/concepts')
      expect(redirect).toHaveBeenCalledWith('/admin/concepts')
    })

    it('should throw error on validation failure', async () => {
      const formData = new FormData()
      formData.append('title', 'Short') // Too short

      await expect(createConceptAction(formData)).rejects.toThrow()
      expect(Registry.createConcept).not.toHaveBeenCalled()
    })
  })

  describe('updateConceptAction', () => {
    it('should update concept and redirect on success', async () => {
      const formData = new FormData()
      formData.append('title', 'Updated Concept')
      formData.append('description', 'Updated Description Long Enough')
      formData.append('category', 'Updated Category')

      await updateConceptAction('123', formData)

      expect(Registry.updateConcept).toHaveBeenCalledWith('123', {
        title: 'Updated Concept',
        description: 'Updated Description Long Enough',
        category: 'Updated Category',
      })
      expect(revalidatePath).toHaveBeenCalledWith('/admin/concepts')
      expect(redirect).toHaveBeenCalledWith('/admin/concepts')
    })
  })

  describe('deleteConceptAction', () => {
    it('should delete concept and revalidate path', async () => {
      await deleteConceptAction('123')

      expect(Registry.deleteConcept).toHaveBeenCalledWith('123')
      expect(revalidatePath).toHaveBeenCalledWith('/admin/concepts')
    })
  })
})
