import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegisterPage from './page'
import { useRouter } from 'next/navigation'
import { Registry } from '@/registry'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/registry', () => ({
  Registry: {
    signUp: jest.fn(),
  },
}))

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    })
  })

  it('renders register form correctly', () => {
    render(<RegisterPage />)
    expect(screen.getByText('Daftar Akun')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Password', { selector: 'input' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Konfirmasi Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Daftar' })).toBeInTheDocument()
  })

  it('shows error when passwords do not match', async () => {
    render(<RegisterPage />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText('Konfirmasi Password'), {
      target: { value: 'different' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Daftar' }))

    expect(await screen.findByText('Password tidak cocok')).toBeInTheDocument()
    expect(Registry.signUp).not.toHaveBeenCalled()
  })

  it('shows success message after successful registration', async () => {
    ;(Registry.signUp as jest.Mock).mockResolvedValueOnce({ success: true })
    render(<RegisterPage />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'newuser@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText('Konfirmasi Password'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Daftar' }))

    await waitFor(() => {
      expect(Registry.signUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'password123',
      })
    })

    expect(await screen.findByText('Pendaftaran Berhasil!')).toBeInTheDocument()
  })
})
