import type { Metadata } from 'next'
import { Merriweather } from 'next/font/google'
import './globals.css'

const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Beringin - Ilmu yang Berakar Kuat',
  description:
    'Sistem pembelajaran berbasis bukti dengan prediksi retensi akurat',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={merriweather.variable}>{children}</body>
    </html>
  )
}
