'use client'

// UI Component: Dashboard Page
// WAJIB: Hanya render, logic di use case

import { useState, useEffect } from 'react'
import { getConceptStatus } from '@/application/usecases/getConceptStatus.usecase'
import { conceptProgressRepository } from '@/infrastructure/repositories/in-memory.repository'
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

  const userId = 'demo-user'

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    const result = await getConceptStatus({ userId }, conceptProgressRepository)
    setConcepts(result.concepts)
    setStats(result.stats)
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'stable': return 'bg-green-500'
      case 'fragile': return 'bg-yellow-500'
      case 'learning': return 'bg-blue-500'
      case 'lapsed': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case 'stable': return 'Stabil'
      case 'fragile': return 'Rapuh'
      case 'learning': return 'Belajar'
      case 'lapsed': return 'Lupa'
      case 'reviewing': return 'Review'
      default: return 'Baru'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-beringin-green to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-white mb-8">
          <h1 className="text-4xl font-serif mb-2">🌳 Dashboard Beringin</h1>
          <p className="text-lg opacity-90">Sistem Akar Pengetahuan Anda</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-sm opacity-80">Total Konsep</div>
          </div>
          <div className="bg-green-500/20 backdrop-blur rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">{stats.stable}</div>
            <div className="text-sm opacity-80">Stabil</div>
          </div>
          <div className="bg-yellow-500/20 backdrop-blur rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">{stats.fragile}</div>
            <div className="text-sm opacity-80">Rapuh</div>
          </div>
          <div className="bg-blue-500/20 backdrop-blur rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">{stats.learning}</div>
            <div className="text-sm opacity-80">Belajar</div>
          </div>
          <div className="bg-red-500/20 backdrop-blur rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">{stats.lapsed}</div>
            <div className="text-sm opacity-80">Lupa</div>
          </div>
        </div>

        {/* Concept List */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-serif mb-6">Konsep Anda</h2>
          
          {concepts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-4">Belum ada konsep.</p>
              <a href="/admin" className="text-beringin-green hover:underline">
                Tambahkan konsep pertama Anda →
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {concepts.map((concept) => (
                <div
                  key={concept.id}
                  className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-lg hover:border-beringin-green transition"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{concept.title}</h3>
                    <p className="text-sm text-gray-600">{concept.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {concept.category}
                      </span>
                      {concept.nextReview && (
                        <span>
                          Review: {new Date(concept.nextReview).toLocaleDateString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`${getStatusColor(concept.status)} text-white px-4 py-2 rounded-lg font-semibold`}>
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
            className="flex-1 bg-beringin-gold text-gray-900 py-4 rounded-lg font-semibold text-center hover:bg-yellow-500 transition"
          >
            Mulai Belajar
          </a>
          <a
            href="/admin"
            className="flex-1 bg-white/10 text-white py-4 rounded-lg font-semibold text-center hover:bg-white/20 transition"
          >
            Kelola Konten
          </a>
        </div>
      </div>
    </main>
  )
}
