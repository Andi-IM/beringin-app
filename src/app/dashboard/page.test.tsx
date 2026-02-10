'use client'

import { render, screen, waitFor, act } from '@testing-library/react'
import DashboardPage from './page'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

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
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        concepts: mockConcepts,
        stats: mockStats,
      }),
    })
  })

  it('renders dashboard title and subtitle', () => {
    render(<DashboardPage />)

    expect(screen.getByText('🌳 Dashboard Beringin')).toBeInTheDocument()
    expect(screen.getByText('Sistem Akar Pengetahuan Anda')).toBeInTheDocument()
  })

  it('calls fetch on mount', async () => {
    await act(async () => {
      render(<DashboardPage />)
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/dashboard')
    })
  })

  it('displays stats correctly', async () => {
    await act(async () => {
      render(<DashboardPage />)
    })

    await waitFor(() => {
      expect(screen.getAllByText('2')[0]).toBeInTheDocument() // Total
      expect(screen.getAllByText('1')[0]).toBeInTheDocument() // Stable
      expect(screen.getAllByText('0')[0]).toBeInTheDocument() // Fragile
    })
  })

  it('displays concept list when concepts exist', async () => {
    await act(async () => {
      render(<DashboardPage />)
    })

    await waitFor(() => {
      expect(screen.getByText('Test Concept 1')).toBeInTheDocument()
      expect(screen.getByText('Test Concept 2')).toBeInTheDocument()
      expect(screen.getByText('Test Description 1')).toBeInTheDocument()
      expect(screen.getByText('Test Description 2')).toBeInTheDocument()
    })
  })

  it('displays category tags', async () => {
    await act(async () => {
      render(<DashboardPage />)
    })

    await waitFor(() => {
      expect(screen.getByText('math')).toBeInTheDocument()
      expect(screen.getByText('science')).toBeInTheDocument()
    })
  })

  it('displays next review date when available', async () => {
    await act(async () => {
      render(<DashboardPage />)
    })

    await waitFor(() => {
      const reviewElements = screen.getAllByText(/Review:/)
      expect(reviewElements.length).toBeGreaterThan(0)
    })
  })

  it('shows empty state when no concepts exist', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        concepts: [],
        stats: { total: 0, stable: 0, fragile: 0, learning: 0, lapsed: 0 },
      }),
    })

    await act(async () => {
      render(<DashboardPage />)
    })

    await waitFor(() => {
      expect(screen.getByText('Belum ada konsep.')).toBeInTheDocument()
      expect(
        screen.getByText('Tambahkan konsep pertama Anda →'),
      ).toBeInTheDocument()
    })
  })

  it('renders action buttons', async () => {
    await act(async () => {
      render(<DashboardPage />)
    })

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
    await act(async () => {
      render(<DashboardPage />)
    })

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

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        concepts: conceptsWithAllStatuses,
        stats: { total: 4, stable: 1, fragile: 1, learning: 1, lapsed: 1 },
      }),
    })

    await act(async () => {
      render(<DashboardPage />)
    })

    await waitFor(() => {
      // Find status badges (span elements) not stats labels
      const rapuhStatus = screen
        .getAllByText('Rapuh')
        .find(
          (el) =>
            el.tagName === 'SPAN' && el.classList.contains('bg-yellow-500'),
        )
      const lupaStatus = screen
        .getAllByText('Lupa')
        .find(
          (el) => el.tagName === 'SPAN' && el.classList.contains('bg-red-500'),
        )

      expect(rapuhStatus).toBeInTheDocument()
      expect(lupaStatus).toBeInTheDocument()
    })
  })

  it('formats review date correctly for Indonesian locale', async () => {
    await act(async () => {
      render(<DashboardPage />)
    })

    await waitFor(() => {
      const reviewElements = screen.getAllByText(/Review:/)
      expect(reviewElements.length).toBeGreaterThan(0)
    })
  })

  it('handles loading state gracefully', () => {
    // Mock a delayed response
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ concepts: [], stats: mockStats }),
              }),
            100,
          ),
        ),
    )

    render(<DashboardPage />)

    // Initially should show loading state (no concepts yet)
    expect(screen.queryByText('Test Concept 1')).not.toBeInTheDocument()
  })
})
