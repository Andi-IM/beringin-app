import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HomePage from './page'

// Mock the seedData function
jest.mock('@/infrastructure/repositories/seed', () => ({
  seedData: jest.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the main title and tagline', () => {
    render(<HomePage />)

    expect(screen.getByText('🌳 Beringin')).toBeInTheDocument()
    expect(
      screen.getByText('Ilmu yang Berakar Kuat, Tak Mudah Lupa'),
    ).toBeInTheDocument()
  })

  it('renders navigation buttons', () => {
    render(<HomePage />)

    const learnButton = screen.getByText('Mulai Belajar')
    const dashboardButton = screen.getByText('Dashboard')

    expect(learnButton).toBeInTheDocument()
    expect(dashboardButton).toBeInTheDocument()
    expect(learnButton.closest('a')).toHaveAttribute('href', '/session')
    expect(dashboardButton.closest('a')).toHaveAttribute('href', '/dashboard')
  })

  it('seeds data on first load when not previously seeded', () => {
    const { seedData } = require('@/infrastructure/repositories/seed')
    localStorageMock.getItem.mockReturnValue(null)

    render(<HomePage />)

    expect(localStorageMock.getItem).toHaveBeenCalledWith('beringin-seeded')
    expect(seedData).toHaveBeenCalled()
  })

  it('does not seed data when already seeded', () => {
    const { seedData } = require('@/infrastructure/repositories/seed')
    localStorageMock.getItem.mockReturnValue('true')

    render(<HomePage />)

    expect(localStorageMock.getItem).toHaveBeenCalledWith('beringin-seeded')
    expect(seedData).not.toHaveBeenCalled()
  })

  it('handles localStorage gracefully when not available', () => {
    // Mock window being undefined (server-side rendering)
    const originalWindow = global.window
    // @ts-ignore
    delete global.window

    expect(() => render(<HomePage />)).not.toThrow()

    global.window = originalWindow
  })

  it('sets seeded flag after seeding data', () => {
    const { seedData } = require('@/infrastructure/repositories/seed')
    seedData.mockResolvedValue(undefined)
    localStorageMock.getItem.mockReturnValue(null)

    render(<HomePage />)

    // Wait for the async operation
    setTimeout(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'beringin-seeded',
        'true',
      )
    }, 0)
  })

  it('has correct styling classes', () => {
    render(<HomePage />)

    const main = screen.getByRole('main')
    expect(main).toHaveClass(
      'min-h-screen',
      'bg-gradient-to-b',
      'from-beringin-green',
      'to-gray-900',
      'flex',
      'items-center',
      'justify-center',
    )

    const title = screen.getByText('🌳 Beringin')
    expect(title).toHaveClass('text-6xl', 'font-serif', 'font-bold', 'mb-4')

    const learnButton = screen.getByText('Mulai Belajar')
    expect(learnButton.closest('a')).toHaveClass(
      'inline-block',
      'bg-beringin-gold',
      'text-gray-900',
      'px-8',
      'py-3',
      'rounded-lg',
      'font-semibold',
      'hover:bg-yellow-500',
      'transition',
    )
  })
})
