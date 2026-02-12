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

jest.mock('@/infrastructure/auth/supabase-client', () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      }),
    },
  }),
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

      expect(Registry.createConcept).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Concept',
          description: 'Test Description Long Enough',
          category: 'Test Category',
          userId: 'user-123',
        }),
      )
      expect(revalidatePath).toHaveBeenCalledWith('/studio/concepts')
      expect(redirect).toHaveBeenCalledWith('/studio/concepts')
    })

    it('should throw error on validation failure', async () => {
      const formData = new FormData()
      formData.append('title', 'Short') // Too short

      await expect(createConceptAction(formData)).rejects.toThrow()
      expect(Registry.createConcept).not.toHaveBeenCalled()
    })
  })

  describe('updateConceptAction', () => {
    it('should update concept and redirect', async () => {
      const formData = new FormData()
      formData.set('title', 'Updated Concept')
      formData.set('description', 'Updated Desc')
      formData.set('category', 'Updated Cat')
      ;(Registry.updateConcept as jest.Mock).mockResolvedValue({
        id: '123',
        title: 'Updated Concept',
      })
      ;(revalidatePath as jest.Mock).mockReturnValue(undefined)
      ;(redirect as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      try {
        await updateConceptAction('123', formData)
      } catch (e) {
        // ignore redirect error
      }

      expect(Registry.updateConcept).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({
          title: 'Updated Concept',
        }),
      )
      expect(revalidatePath).toHaveBeenCalledWith('/studio/concepts')
      expect(redirect).toHaveBeenCalledWith('/studio/concepts')
    })
  })

  describe('deleteConceptAction', () => {
    it('should delete concept and revalidate path', async () => {
      ;(Registry.deleteConcept as jest.Mock).mockResolvedValue(undefined)
      ;(revalidatePath as jest.Mock).mockReturnValue(undefined)

      await deleteConceptAction('123')

      expect(Registry.deleteConcept).toHaveBeenCalledWith('123')
      expect(revalidatePath).toHaveBeenCalledWith('/studio/concepts')
    })
  })
})
