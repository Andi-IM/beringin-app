import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DashboardPage from './page'
import { DashboardApi } from '@/infrastructure/client/dashboard.api'
import { AuthApi } from '@/infrastructure/client/auth.api'

// Mock APIs
jest.mock('@/infrastructure/client/dashboard.api', () => ({
  DashboardApi: {
    getDashboardData: jest.fn(),
  },
}))

jest.mock('@/infrastructure/client/auth.api', () => ({
  AuthApi: {
    signOut: jest.fn(),
  },
}))

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

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
    ;(DashboardApi.getDashboardData as jest.Mock).mockResolvedValue({
      concepts: mockConcepts,
      stats: mockStats,
    })
  })

  it('renders dashboard title and subtitle', () => {
    render(<DashboardPage />)

    expect(screen.getByText('🌳 Dashboard Beringin')).toBeInTheDocument()
    expect(screen.getByText('Sistem Akar Pengetahuan Anda')).toBeInTheDocument()
  })

  it('calls DashboardApi on mount and displays data', async () => {
    render(<DashboardPage />)

    await waitFor(() => {
      expect(DashboardApi.getDashboardData).toHaveBeenCalled()
    })

    expect(await screen.findByText('Test Concept 1')).toBeInTheDocument()
    expect(await screen.findByText('Test Concept 2')).toBeInTheDocument()
  })

  it('displays stats correctly', async () => {
    render(<DashboardPage />)

    // Wait for the total to be displayed
    const totalStat = await screen.findByText(mockStats.total.toString())
    expect(totalStat).toBeInTheDocument()
    expect(totalStat.nextSibling).toHaveTextContent('Total Konsep')

    // 'Stabil' and 'Belajar' appear both in stats and on concept cards,
    // so we use getAllByText and pick the one in the stats grid (opacity-80 label).
    const stableElements = await screen.findAllByText('Stabil')
    const stableStatLabel = stableElements.find((el) =>
      el.className.includes('opacity-80'),
    )
    expect(stableStatLabel).toBeDefined()
    expect(stableStatLabel!.previousSibling).toHaveTextContent(
      mockStats.stable.toString(),
    )

    const learningElements = await screen.findAllByText('Belajar')
    const learningStatLabel = learningElements.find((el) =>
      el.className.includes('opacity-80'),
    )
    expect(learningStatLabel).toBeDefined()
    expect(learningStatLabel!.previousSibling).toHaveTextContent(
      mockStats.learning.toString(),
    )
  })

  it('shows empty state when no concepts exist', async () => {
    ;(DashboardApi.getDashboardData as jest.Mock).mockResolvedValueOnce({
      concepts: [],
      stats: { total: 0, stable: 0, fragile: 0, learning: 0, lapsed: 0 },
    })

    render(<DashboardPage />)

    expect(await screen.findByText('Belum ada konsep.')).toBeInTheDocument()
    expect(
      await screen.findByText('Tambahkan konsep pertama Anda →'),
    ).toBeInTheDocument()
  })

  it('handles logout correctly', async () => {
    ;(AuthApi.signOut as jest.Mock).mockResolvedValueOnce(undefined)

    render(<DashboardPage />)

    const logoutButton = screen.getByText('Keluar')
    fireEvent.click(logoutButton)

    await waitFor(() => {
      expect(AuthApi.signOut).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })
})
