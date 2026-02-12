import { render, screen } from '@testing-library/react'
import { StudioSidebar } from './StudioSidebar'

describe('StudioSidebar', () => {
  it('should render navigation links', () => {
    render(<StudioSidebar />)

    expect(screen.getByText('Knowledge Studio')).toBeInTheDocument()
    expect(screen.getByText('Personal Space')).toBeInTheDocument()
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Konsep')).toBeInTheDocument()
    expect(screen.getByText('← Kembali ke Dashboard')).toBeInTheDocument()
  })
})
