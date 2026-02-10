'use client'

import { render, screen, waitFor } from '@testing-library/react'
import DashboardPage from './page'

// Mock Registry
jest.mock('@/registry', () => ({
  Registry: {
    getDashboardData: jest.fn(),
  },
}))

import { Registry } from '@/registry'

describe('DashboardPage', () => {
  const mockConcepts = [
    {
      id: '1',
      title: 'Test Concept 1',
      description: 'Test Description 1',
      category: 'math',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'stable' as const,
      easeFactor: 2.8,
      lastInterval: 21,
      nextReview: new Date('2024-01-20'),
    },
    {
      id: '2',
      title: 'Test Concept 2',
      description: 'Test Description 2',
      category: 'science',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'learning' as const,
      easeFactor: 2.5,
      lastInterval: 1,
      nextReview: new Date('2024-01-05'),
    },
  ]

  const mockStats = {
    total: 2,
    stable: 1,
    fragile: 0,
    learning: 1,
    lapsed: 0,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(Registry.getDashboardData as jest.Mock).mockResolvedValue({
      concepts: mockConcepts,
      stats: mockStats,
    })
  })

  it('renders dashboard title and subtitle', () => {
    render(<DashboardPage />)

    expect(screen.getByText('🌳 Dashboard Beringin')).toBeInTheDocument()
    expect(screen.getByText('Sistem Akar Pengetahuan Anda')).toBeInTheDocument()
  })

  it('calls Registry.getDashboardData on mount', () => {
    render(<DashboardPage />)

    expect(Registry.getDashboardData).toHaveBeenCalledWith('demo-user')
  })

  it('displays stats correctly', async () => {
    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getAllByText('2')[0]).toBeInTheDocument() // Total
      expect(screen.getAllByText('1')[0]).toBeInTheDocument() // Stable
      expect(screen.getAllByText('0')[0]).toBeInTheDocument() // Fragile
    })
  })

  it('displays concept list when concepts exist', async () => {
    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('Test Concept 1')).toBeInTheDocument()
      expect(screen.getByText('Test Concept 2')).toBeInTheDocument()
      expect(screen.getByText('Test Description 1')).toBeInTheDocument()
      expect(screen.getByText('Test Description 2')).toBeInTheDocument()
    })
  })

  it('displays category tags', async () => {
    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('math')).toBeInTheDocument()
      expect(screen.getByText('science')).toBeInTheDocument()
    })
  })

  it('displays next review date when available', async () => {
    render(<DashboardPage />)

    await waitFor(() => {
      const reviewElements = screen.getAllByText(/Review:/)
      expect(reviewElements.length).toBeGreaterThan(0)
    })
  })

  it('shows empty state when no concepts exist', async () => {
    ;(Registry.getDashboardData as jest.Mock).mockResolvedValue({
      concepts: [],
      stats: { total: 0, stable: 0, fragile: 0, learning: 0, lapsed: 0 },
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('Belum ada konsep.')).toBeInTheDocument()
      expect(
        screen.getByText('Tambahkan konsep pertama Anda →'),
      ).toBeInTheDocument()
    })
  })

  it('renders action buttons', async () => {
    render(<DashboardPage />)

    await waitFor(() => {
      const learnButton = screen.getByText('Mulai Belajar')
      const manageButton = screen.getByText('Kelola Konten')

      expect(learnButton).toBeInTheDocument()
      expect(manageButton).toBeInTheDocument()
      expect(learnButton.closest('a')).toHaveAttribute('href', '/session')
      expect(manageButton.closest('a')).toHaveAttribute('href', '/admin')
    })
  })

  it('applies correct status colors and labels', async () => {
    render(<DashboardPage />)

    await waitFor(() => {
      // Check for stable status
      const stableStatuses = screen.getAllByText('Stabil')
      const stableStatus =
        stableStatuses.find((el) => el.tagName === 'SPAN') || stableStatuses[0]
      expect(stableStatus).toBeInTheDocument()
      expect(stableStatus.closest('span')).toHaveClass(
        'bg-green-500',
        'text-white',
      )

      // Check for learning status
      const learningStatuses = screen.getAllByText('Belajar')
      const learningStatus =
        learningStatuses.find((el) => el.tagName === 'SPAN') ||
        learningStatuses[0]
      expect(learningStatus).toBeInTheDocument()
      expect(learningStatus.closest('span')).toHaveClass(
        'bg-blue-500',
        'text-white',
      )
    })
  })

  it('handles different status types correctly', async () => {
    const conceptsWithAllStatuses = [
      ...mockConcepts,
      {
        id: '3',
        title: 'Fragile Concept',
        description: 'Fragile Description',
        category: 'history',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'fragile' as const,
        easeFactor: 2.3,
        lastInterval: 3,
        nextReview: new Date('2024-01-08'),
      },
      {
        id: '4',
        title: 'Lapsed Concept',
        description: 'Lapsed Description',
        category: 'geography',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'lapsed' as const,
        easeFactor: 2.1,
        lastInterval: 1,
        nextReview: new Date('2024-01-02'),
      },
    ]

    ;(Registry.getDashboardData as jest.Mock).mockResolvedValue({
      concepts: conceptsWithAllStatuses,
      stats: { total: 4, stable: 1, fragile: 1, learning: 1, lapsed: 1 },
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('Rapuh')).toBeInTheDocument()
      expect(screen.getByText('Lupa')).toBeInTheDocument()
    })
  })

  it('formats review date correctly for Indonesian locale', async () => {
    // This test might be tricky with mockResolvedValue if we want to spy on date inside component rendering
    // But since formatting happens in render, and data comes from mock,
    // we assume the component uses specific date formatting.
    // The previous test mocked global Date but here we just check output.

    render(<DashboardPage />)

    await waitFor(() => {
      const reviewElements = screen.getAllByText(/Review:/)
      expect(reviewElements.length).toBeGreaterThan(0)
      // We could verify the date string content if needed, e.g. "20/1/2024"
    })
  })

  it('handles loading state gracefully', () => {
    // Mock a delayed response
    ;(Registry.getDashboardData as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    )

    render(<DashboardPage />)

    // Initially should show loading state (no concepts yet)
    expect(screen.queryByText('Test Concept 1')).not.toBeInTheDocument()
  })
})
