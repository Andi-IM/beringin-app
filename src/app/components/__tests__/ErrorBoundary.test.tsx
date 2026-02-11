import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '../ErrorBoundary'
import { logger } from '@/lib/logger'

// Mock the logger
jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}))

const ThrowError = () => {
  throw new Error('Test Error')
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Prevent React from logging the expected error to the console
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    ;(console.error as jest.Mock).mockRestore()
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe Content</div>
      </ErrorBoundary>,
    )
    expect(screen.getByText('Safe Content')).toBeInTheDocument()
  })

  it('renders fallback UI when an error is caught', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Waduh, ada masalah dikit...')).toBeInTheDocument()
    expect(logger.error).toHaveBeenCalled()
  })

  it('renders custom fallback UI if provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom Fallback</div>}>
        <ThrowError />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Custom Fallback')).toBeInTheDocument()
  })

  it('resets the error state when "Coba Lagi" is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Waduh, ada masalah dikit...')).toBeInTheDocument()

    // Re-render without the component that throws error
    rerender(
      <ErrorBoundary>
        <div>Safe Content Now</div>
      </ErrorBoundary>,
    )

    fireEvent.click(screen.getByText('Coba Lagi'))

    expect(
      screen.queryByText('Waduh, ada masalah dikit...'),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Safe Content Now')).toBeInTheDocument()
  })
})
