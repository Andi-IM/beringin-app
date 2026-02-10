import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

  it('navigates to dashboard on successful login', async () => {
    ;(Registry.signIn as jest.Mock).mockResolvedValueOnce({ success: true })
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }))

    await waitFor(() => {
      expect(Registry.signIn).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      })
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows error message on failed login', async () => {
    ;(Registry.signIn as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Invalid credentials',
    })
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong-password' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })
})
