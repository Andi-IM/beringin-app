import { render, screen } from '@testing-library/react'
import { AdminSidebar } from './AdminSidebar'

describe('AdminSidebar', () => {
  it('should render navigation links', () => {
    render(<AdminSidebar />)

    expect(screen.getByText('Beringin Admin')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Konsep')).toBeInTheDocument()
    expect(screen.getByText('← Kembali ke Aplikasi')).toBeInTheDocument()
  })
})
