'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to our centralized logger
    logger.error('Route error caught by Next.js Error boundary:', error, {
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-bold text-gray-900">
        Oops! Ada gangguan koneksi atau data.
      </h2>
      <p className="mb-6 max-w-md text-gray-600">
        Aplikasi mengalami kendala saat memuat halaman ini. Silakan coba tekan
        tombol di bawah untuk memuat ulang.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-95"
        >
          Coba Lagi
        </button>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
        >
          Muat Ulang Seluruh Halaman
        </button>
      </div>
    </div>
  )
}
