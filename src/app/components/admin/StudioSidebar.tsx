import Link from 'next/link'

export function StudioSidebar() {
  return (
    <aside className="min-h-screen w-64 bg-gray-900 p-4 text-white">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Knowledge Studio</h2>
        <p className="text-xs text-gray-400">Personal Space</p>
      </div>

      <nav className="space-y-2">
        <Link
          href="/studio"
          className="block rounded px-4 py-2 transition-colors hover:bg-gray-800"
        >
          Overview
        </Link>
        <Link
          href="/studio/concepts"
          className="block rounded px-4 py-2 transition-colors hover:bg-gray-800"
        >
          Konsep
        </Link>
        <Link
          href="/dashboard"
          className="mt-8 block px-4 py-2 text-gray-400 transition-colors hover:text-white"
        >
          ← Kembali ke Dashboard
        </Link>
      </nav>
    </aside>
  )
}
