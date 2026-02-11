import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ConceptForm } from './ConceptForm'
import {
  createConceptAction,
  updateConceptAction,
} from '@/app/admin/concepts/actions'
import type { Concept } from '@/domain/entities/concept.entity'

// Mock server actions - using manual mock from src/app/admin/concepts/__mocks__/actions.ts
jest.mock('@/app/admin/concepts/actions')

const mockConcept: Concept = {
  id: '1',
  title: 'Existing Concept',
  description: 'Existing Description',
  category: 'Existing Category',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('ConceptForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render create form by default', () => {
    render(<ConceptForm />)
    expect(
      screen.getByText('Create Concept', { selector: 'button' }),
    ).toBeInTheDocument()
  })

  it('should render edit form when initialData provided', () => {
    render(<ConceptForm initialData={mockConcept} />)
    expect(screen.getByDisplayValue('Existing Concept')).toBeInTheDocument()
    expect(
      screen.getByText('Update Concept', { selector: 'button' }),
    ).toBeInTheDocument()
  })

  it('should show validation errors', async () => {
    render(<ConceptForm />)

    // Submit empty form
    fireEvent.click(screen.getByText('Create Concept', { selector: 'button' }))

    await waitFor(() => {
      expect(
        screen.getByText('Title must be at least 3 characters'),
      ).toBeInTheDocument()
      expect(screen.getByText('Category is required')).toBeInTheDocument()
    })
  })

  it('should call create action on submit', async () => {
    render(<ConceptForm />)

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Title' },
    })
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'New Category' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Long enough description for validation' },
    })

    fireEvent.click(screen.getByText('Create Concept', { selector: 'button' }))

    await waitFor(() => {
      expect(createConceptAction).toHaveBeenCalled()
    })
  })

  it('should call update action on submit when editing', async () => {
    render(<ConceptForm initialData={mockConcept} />)

    const titleInput = screen.getByLabelText('Title')
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } })

    fireEvent.click(screen.getByText('Update Concept', { selector: 'button' }))

    await waitFor(() => {
      expect(updateConceptAction).toHaveBeenCalled()
    })
  })

  it('should handle submission error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(createConceptAction as jest.Mock).mockRejectedValue(new Error('Failed'))

    render(<ConceptForm />)

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Title' },
    })
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'New Category' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Long enough description for validation' },
    })

    fireEvent.click(screen.getByText('Create Concept', { selector: 'button' }))

    await waitFor(() => {
      expect(
        screen.getByText('Failed to save concept. Please try again.'),
      ).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  it('should handle NEXT_REDIRECT error safely in tests', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const redirectError = new Error('NEXT_REDIRECT')
    ;(redirectError as any).handledByTest = true
    ;(createConceptAction as jest.Mock).mockRejectedValue(redirectError)

    render(<ConceptForm />)

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Title' },
    })
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'New Category' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Long enough description for validation' },
    })

    fireEvent.click(screen.getByText('Create Concept', { selector: 'button' }))

    await waitFor(() => {
      expect(createConceptAction).toHaveBeenCalled()
    })

    // Validate that we reached the catch block but didn't log an error or show UI error
    expect(consoleSpy).not.toHaveBeenCalled()
    expect(
      screen.queryByText('Failed to save concept. Please try again.'),
    ).not.toBeInTheDocument()

    consoleSpy.mockRestore()
  })
})
