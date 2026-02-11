import Link from 'next/link'

export function AdminSidebar() {
  return (
    <aside className="min-h-screen w-64 bg-gray-900 p-4 text-white">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Beringin Admin</h2>
        <p className="text-xs text-gray-400">Content Management</p>
      </div>

      <nav className="space-y-2">
        <Link
          href="/admin/dashboard"
          className="block rounded px-4 py-2 transition-colors hover:bg-gray-800"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/concepts"
          className="block rounded px-4 py-2 transition-colors hover:bg-gray-800"
        >
          Concepts
        </Link>
        <Link
          href="/"
          className="mt-8 block px-4 py-2 text-gray-400 transition-colors hover:text-white"
        >
          ← Back to App
        </Link>
      </nav>
    </aside>
  )
}
