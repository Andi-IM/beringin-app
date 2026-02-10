import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from './page'
import { useRouter } from 'next/navigation'
import { AuthApi } from '@/infrastructure/client/auth.api'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/infrastructure/client/auth.api', () => ({
  AuthApi: {
    signIn: jest.fn(),
    signInWithGoogle: jest.fn(),
  },
}))

describe('LoginPage', () => {
  const mockPush = jest.fn()
  const mockRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(AuthApi.signIn as jest.Mock).mockReset()
    ;(AuthApi.signInWithGoogle as jest.Mock).mockReset()
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
    expect(
      screen.getByRole('button', { name: 'Masuk dengan Google' }),
    ).toBeInTheDocument()
  })

  it('navigates to dashboard on successful login', async () => {
    ;(AuthApi.signIn as jest.Mock).mockResolvedValueOnce({ success: true })
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }))

    await waitFor(() => {
      expect(AuthApi.signIn).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      })
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows error message on failed login', async () => {
    ;(AuthApi.signIn as jest.Mock).mockResolvedValueOnce({
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

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
  })

  it('shows default error message on failed login without error message', async () => {
    ;(AuthApi.signIn as jest.Mock).mockResolvedValueOnce({
      success: false,
    })
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }))

    expect(await screen.findByText(/gagal masuk/i)).toBeInTheDocument()
  })

  it('shows unexpected error message on API crash', async () => {
    ;(AuthApi.signIn as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('API crash')),
    )
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }))

    await waitFor(() => {
      expect(screen.getByText(/terjadi kesalahan login/i)).toBeInTheDocument()
    })
  })

  it('calls signInWithGoogle on button click', async () => {
    ;(AuthApi.signInWithGoogle as jest.Mock).mockResolvedValueOnce({
      success: true,
    })
    render(<LoginPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Masuk dengan Google' }))

    await waitFor(() => {
      expect(AuthApi.signInWithGoogle).toHaveBeenCalled()
    })
  })

  it('shows error message on failed google login', async () => {
    ;(AuthApi.signInWithGoogle as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Google login failed',
    })
    render(<LoginPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Masuk dengan Google' }))

    expect(await screen.findByText(/google login failed/i)).toBeInTheDocument()
  })

  it('shows default error message on failed google login without error message', async () => {
    ;(AuthApi.signInWithGoogle as jest.Mock).mockResolvedValueOnce({
      success: false,
    })
    render(<LoginPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Masuk dengan Google' }))

    expect(
      await screen.findByText(/gagal masuk dengan google/i),
    ).toBeInTheDocument()
  })

  it('shows unexpected error message on google login API crash', async () => {
    ;(AuthApi.signInWithGoogle as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('API crash')),
    )
    render(<LoginPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Masuk dengan Google' }))

    await waitFor(() => {
      expect(
        screen.getByText(/terjadi kesalahan tak terduga/i),
      ).toBeInTheDocument()
    })
  })
})
