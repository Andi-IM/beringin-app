import { render } from '@testing-library/react'
import RootLayout from './layout'

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Merriweather: jest.fn(() => ({
    variable: '--font-serif',
  })),
}))

describe('RootLayout', () => {
  it('renders with correct HTML structure', () => {
    const { container } = render(
      <html lang="id">
        <RootLayout>
          <div>Test Children</div>
        </RootLayout>
      </html>
    )

    const body = container.querySelector('body')

    expect(body).toBeInTheDocument()
    expect(body).toHaveClass('--font-serif')
  })

  it('applies correct font variable class', () => {
    const { container } = render(
      <html lang="id">
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      </html>
    )

    const body = container.querySelector('body')
    expect(body).toHaveClass('--font-serif')
  })

  it('renders children content', () => {
    const { getByText } = render(
      <RootLayout>
        <div>Test Children Content</div>
      </RootLayout>
    )

    expect(getByText('Test Children Content')).toBeInTheDocument()
  })

  it('handles multiple children', () => {
    const { getByText } = render(
      <RootLayout>
        <div>First Child</div>
        <div>Second Child</div>
        <div>Third Child</div>
      </RootLayout>
    )

    expect(getByText('First Child')).toBeInTheDocument()
    expect(getByText('Second Child')).toBeInTheDocument()
    expect(getByText('Third Child')).toBeInTheDocument()
  })

  it('handles complex children structure', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="complex-child">
          <header>Header Content</header>
          <main>Main Content</main>
          <footer>Footer Content</footer>
        </div>
      </RootLayout>
    )

    const complexChild = getByTestId('complex-child')
    expect(complexChild).toBeInTheDocument()
    expect(complexChild.querySelector('header')).toBeInTheDocument()
    expect(complexChild.querySelector('main')).toBeInTheDocument()
    expect(complexChild.querySelector('footer')).toBeInTheDocument()
  })

  it('has correct metadata export', () => {
    const { metadata } = require('./layout')
    
    expect(metadata.title).toBe('Beringin - Ilmu yang Berakar Kuat')
    expect(metadata.description).toBe('Sistem pembelajaran berbasis bukti dengan prediksi retensi akurat')
  })
})