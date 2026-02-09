import { seedData } from '@/infrastructure/repositories/seed'

export default function HomePage() {
  // Seed data on first load (MVP only)
  if (typeof window !== 'undefined') {
    const hasSeeded = localStorage.getItem('beringin-seeded')
    if (!hasSeeded) {
      seedData().then(() => {
        localStorage.setItem('beringin-seeded', 'true')
      })
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-beringin-green to-gray-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-serif font-bold mb-4">🌳 Beringin</h1>
        <p className="text-xl mb-8">Ilmu yang Berakar Kuat, Tak Mudah Lupa</p>
        <div className="space-x-4">
          <a 
            href="/session" 
            className="inline-block bg-beringin-gold text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            Mulai Belajar
          </a>
          <a 
            href="/dashboard" 
            className="inline-block bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition"
          >
            Dashboard
          </a>
        </div>
      </div>
    </main>
  )
}
