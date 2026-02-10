import { render, screen } from '@testing-library/react'
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
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('renders register form correctly', () => {
    render(<RegisterPage />)
    expect(screen.getByText('Daftar Akun')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Konfirmasi Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Daftar' })).toBeInTheDocument()
  })
})
