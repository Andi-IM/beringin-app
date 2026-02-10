'use client'

// UI Component: Dashboard Page
// WAJIB: Hanya render, logic di use case

import { useState, useEffect } from 'react'
import type { ConceptWithStatus } from '@/domain/entities/concept.entity'

export default function DashboardPage() {
  const [concepts, setConcepts] = useState<ConceptWithStatus[]>([])
  const [stats, setStats] = useState({
    total: 0,
    stable: 0,
    fragile: 0,
    learning: 0,
    lapsed: 0,
  })

  async function handleLogout() {
    try {
      await Registry.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      const response = await fetch(`/api/dashboard`)
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      const result = await response.json()
      setConcepts(result.concepts)
      setStats(result.stats)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'stable':
        return 'bg-green-500'
      case 'fragile':
        return 'bg-yellow-500'
      case 'learning':
        return 'bg-blue-500'
      case 'lapsed':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case 'stable':
        return 'Stabil'
      case 'fragile':
        return 'Rapuh'
      case 'learning':
        return 'Belajar'
      case 'lapsed':
        return 'Lupa'
      case 'reviewing':
        return 'Review'
      default:
        return 'Baru'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-beringin-green to-gray-900 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between text-white">
          <div>
            <h1 className="mb-2 font-serif text-4xl">🌳 Dashboard Beringin</h1>
            <p className="text-lg opacity-90">Sistem Akar Pengetahuan Anda</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            Keluar
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded-lg bg-white/10 p-4 text-white backdrop-blur">
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-sm opacity-80">Total Konsep</div>
          </div>
          <div className="rounded-lg bg-green-500/20 p-4 text-white backdrop-blur">
            <div className="text-3xl font-bold">{stats.stable}</div>
            <div className="text-sm opacity-80">Stabil</div>
          </div>
          <div className="rounded-lg bg-yellow-500/20 p-4 text-white backdrop-blur">
            <div className="text-3xl font-bold">{stats.fragile}</div>
            <div className="text-sm opacity-80">Rapuh</div>
          </div>
          <div className="rounded-lg bg-blue-500/20 p-4 text-white backdrop-blur">
            <div className="text-3xl font-bold">{stats.learning}</div>
            <div className="text-sm opacity-80">Belajar</div>
          </div>
          <div className="rounded-lg bg-red-500/20 p-4 text-white backdrop-blur">
            <div className="text-3xl font-bold">{stats.lapsed}</div>
            <div className="text-sm opacity-80">Lupa</div>
          </div>
        </div>

        {/* Concept List */}
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 font-serif text-2xl">Konsep Anda</h2>

          {concepts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p className="mb-4 text-lg">Belum ada konsep.</p>
              <a href="/admin" className="text-beringin-green hover:underline">
                Tambahkan konsep pertama Anda →
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {concepts.map((concept) => (
                <div
                  key={concept.id}
                  className="flex items-center justify-between rounded-lg border-2 border-gray-100 p-4 transition hover:border-beringin-green"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{concept.title}</h3>
                    <p className="text-sm text-gray-600">
                      {concept.description}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <span className="rounded bg-gray-100 px-2 py-1">
                        {concept.category}
                      </span>
                      {concept.nextReview && (
                        <span>
                          Review:{' '}
                          {new Date(concept.nextReview).toLocaleDateString(
                            'id-ID',
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`${getStatusColor(concept.status)} rounded-lg px-4 py-2 font-semibold text-white`}
                    >
                      {getStatusLabel(concept.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <a
            href="/session"
            className="flex-1 rounded-lg bg-beringin-gold py-4 text-center font-semibold text-gray-900 transition hover:bg-yellow-500"
          >
            Mulai Belajar
          </a>
          <a
            href="/admin"
            className="flex-1 rounded-lg bg-white/10 py-4 text-center font-semibold text-white transition hover:bg-white/20"
          >
            Kelola Konten
          </a>
        </div>
      </div>
    </main>
  )
}
