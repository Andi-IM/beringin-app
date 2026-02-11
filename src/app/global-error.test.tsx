import { render, screen, fireEvent } from '@testing-library/react'
import GlobalError from './global-error'
import { logger } from '@/lib/logger'

// Mock the logger
jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe('GlobalError Component', () => {
  const mockReset = jest.fn()
  const mockError = new Error('Global test error') as Error & {
    digest?: string
  }
  mockError.digest = 'global-digest'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders global error information correctly', () => {
    render(<GlobalError error={mockError} reset={mockReset} />)

    expect(screen.getByText(/System Error \(Global\)/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Terjadi masalah kritis pada tingkat sistem/i),
    ).toBeInTheDocument()
  })

  it('logs the global error on mount', () => {
    render(<GlobalError error={mockError} reset={mockReset} />)

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Global root error caught by Next.js GlobalError',
      ),
      mockError,
      { digest: 'global-digest' },
    )
  })

  it('calls reset function when "Restart Aplikasi" is clicked', () => {
    render(<GlobalError error={mockError} reset={mockReset} />)

    const restartButton = screen.getByRole('button', {
      name: /Restart Aplikasi/i,
    })
    fireEvent.click(restartButton)

    expect(mockReset).toHaveBeenCalledTimes(1)
  })
})
