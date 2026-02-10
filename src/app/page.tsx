export default function HomePage() {
  // Seed data on first load (MVP only)
  if (typeof window !== 'undefined') {
    const hasSeeded = localStorage.getItem('beringin-seeded')
    if (!hasSeeded) {
      // Note: This violates architecture but acceptable for MVP seed
      // TODO: Move to use case in production
      // eslint-disable-next-line no-restricted-globals
      fetch('/api/debug/seed', { method: 'POST' }).then((res) => {
        if (res.ok) {
          localStorage.setItem('beringin-seeded', 'true')
        }
      })
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-beringin-green to-gray-900 px-4">
      <div className="absolute right-8 top-8">
        <a
          href="/login"
          className="rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Masuk
        </a>
      </div>

      <div className="text-center text-white">
        <h1 className="mb-4 font-serif text-6xl font-bold">🌳 Beringin</h1>
        <p className="mb-8 text-xl">Ilmu yang Berakar Kuat, Tak Mudah Lupa</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="/session"
            className="inline-block rounded-xl bg-beringin-gold px-8 py-3 font-semibold text-gray-900 shadow-lg transition hover:scale-105 hover:bg-yellow-500"
          >
            Mulai Belajar
          </a>
          <a
            href="/dashboard"
            className="inline-block rounded-xl bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-sm transition hover:scale-105 hover:bg-white/20"
          >
            Dashboard Konten
          </a>
        </div>
      </div>
    </main>
  )
}
