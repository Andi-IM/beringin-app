'use client'

import { useState } from 'react'
import ErrorBoundary from '@/app/components/ErrorBoundary'

import { notFound } from 'next/navigation'

const BuggyComponent = () => {
  throw new Error('Debug Error: Bukti bahwa Error Boundary bekerja!')
}

export default function ErrorTestPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  const [shouldCrash, setShouldCrash] = useState(false)

  return (
    <div className="p-10">
      <h1 className="mb-4 text-2xl font-bold">Debug Error Boundary</h1>
      <p className="mb-4">
        Klik tombol di bawah untuk men-simulasikan crash dalam komponen.
      </p>

      <div className="rounded-xl border-2 border-dashed border-gray-300 p-6">
        <ErrorBoundary>
          {shouldCrash ? (
            <BuggyComponent />
          ) : (
            <div className="font-medium text-green-600">
              Komponen ini berjalan normal.
            </div>
          )}
        </ErrorBoundary>
      </div>

      <button
        onClick={() => setShouldCrash(true)}
        className="mt-6 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
      >
        Simulasikan Crash Sekarang
      </button>

      {shouldCrash && (
        <button
          onClick={() => setShouldCrash(false)}
          className="ml-4 mt-6 rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
        >
          Reset State (Luar Boundary)
        </button>
      )}
    </div>
  )
}
