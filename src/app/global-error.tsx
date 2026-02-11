'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Global root error caught:', error)
  }, [error])

  return (
    <html lang="id">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="mb-6 rounded-full bg-red-100 p-4 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-12 w-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            System Error (Global)
          </h1>
          <p className="mb-8 max-w-md text-gray-600">
            Terjadi masalah kritis pada tingkat sistem. Kami telah mencatat
            kejadian ini untuk segera diperbaiki.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-95"
          >
            Restart Aplikasi
          </button>
        </div>
      </body>
    </html>
  )
}
