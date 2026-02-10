import { Registry } from '@/registry'

export default function HomePage() {
  // Seed data on first load (MVP only)
  if (typeof window !== 'undefined') {
    const hasSeeded = localStorage.getItem('beringin-seeded')
    if (!hasSeeded) {
      Registry.seedInitialData().then(() => {
        localStorage.setItem('beringin-seeded', 'true')
      })
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-beringin-green to-gray-900">
      <div className="text-center text-white">
        <h1 className="mb-4 font-serif text-6xl font-bold">🌳 Beringin</h1>
        <p className="mb-8 text-xl">Ilmu yang Berakar Kuat, Tak Mudah Lupa</p>
        <div className="space-x-4">
          <a
            href="/session"
            className="inline-block rounded-lg bg-beringin-gold px-8 py-3 font-semibold text-gray-900 transition hover:bg-yellow-500"
          >
            Mulai Belajar
          </a>
          <a
            href="/dashboard"
            className="inline-block rounded-lg bg-white/10 px-8 py-3 font-semibold text-white transition hover:bg-white/20"
          >
            Dashboard
          </a>
        </div>
      </div>
    </main>
  )
}
