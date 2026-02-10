import { render, screen } from '@testing-library/react'
import LoginPage from './page'
import { useRouter } from 'next/navigation'
import { Registry } from '@/registry'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/registry', () => ({
  Registry: {
    signIn: jest.fn(),
  },
}))

describe('LoginPage', () => {
  const mockPush = jest.fn()
  const mockRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    })
  })

  it('renders login form correctly', () => {
    render(<LoginPage />)
    expect(screen.getByText('Beringin')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument()
  })
})
