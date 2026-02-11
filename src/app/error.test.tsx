import { render, screen, fireEvent } from '@testing-library/react'
import ErrorPage from './error'
import { logger } from '@/lib/logger'

// Mock the logger
jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe('Error Component', () => {
  const mockReset = jest.fn()
  const mockError = new Error('Test error') as Error & { digest?: string }
  mockError.digest = 'test-digest'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders error information correctly', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)

    expect(
      screen.getByText(/Oops! Ada gangguan koneksi atau data/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Aplikasi mengalami kendala saat memuat halaman ini/i),
    ).toBeInTheDocument()
  })

  it('logs the error on mount', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Route error caught by Next.js Error boundary'),
      mockError,
      { digest: 'test-digest' },
    )
  })

  it('calls reset function when "Coba Lagi" is clicked', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)

    const retryButton = screen.getByRole('button', { name: /Coba Lagi/i })
    fireEvent.click(retryButton)

    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('renders the reload button', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    const reloadButton = screen.getByRole('button', {
      name: /Muat Ulang Seluruh Halaman/i,
    })
    expect(reloadButton).toBeInTheDocument()
  })
})
