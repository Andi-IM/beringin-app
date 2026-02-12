import Link from 'next/link'
import { Registry } from '@/registry'
import { ConceptTable } from '@/app/components/admin/ConceptTable'

export default async function ConceptsListPage() {
  const concepts = await Registry.getAllConcepts()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Konsep</h1>
        <Link
          href="/admin/concepts/new"
          className="rounded bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
        >
          Create Concept
        </Link>
      </div>

      <ConceptTable concepts={concepts} />
    </div>
  )
}
