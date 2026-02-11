import { render, screen, fireEvent } from '@testing-library/react'
import { ConceptTable } from './ConceptTable'
import { deleteConceptAction } from '@/app/admin/concepts/actions'
import type { Concept } from '@/domain/entities/concept.entity'

jest.mock('@/app/admin/concepts/actions', () => ({
  deleteConceptAction: jest.fn(),
}))

const mockConcepts: Concept[] = [
  {
    id: '1',
    title: 'Test Concept',
    description: 'Description',
    category: 'Test',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
]

describe('ConceptTable', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render concept list', () => {
    render(<ConceptTable concepts={mockConcepts} />)

    expect(screen.getByText('Test Concept')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should render empty state', () => {
    render(<ConceptTable concepts={[]} />)
    expect(screen.getByText('No concepts found.')).toBeInTheDocument()
  })

  it('should handle delete action', async () => {
    window.confirm = jest.fn(() => true)
    render(<ConceptTable concepts={mockConcepts} />)

    const deleteBtn = screen.getByText('Delete')
    fireEvent.click(deleteBtn)

    expect(window.confirm).toHaveBeenCalled()
    expect(deleteConceptAction).toHaveBeenCalledWith('1')
  })

  it('should handle delete cancellation', async () => {
    window.confirm = jest.fn(() => false)
    render(<ConceptTable concepts={mockConcepts} />)

    const deleteBtn = screen.getByText('Delete')
    fireEvent.click(deleteBtn)

    expect(window.confirm).toHaveBeenCalled()
    expect(deleteConceptAction).not.toHaveBeenCalled()
  })
})
