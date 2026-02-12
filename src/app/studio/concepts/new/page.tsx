import { ConceptForm } from '@/app/components/admin/ConceptForm'
import Link from 'next/link'

export default function NewConceptPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/studio/concepts"
          className="mb-2 inline-block text-indigo-600 hover:text-indigo-900"
        >
          ← Back to List
        </Link>
        <h1 className="text-2xl font-bold">Create New Concept</h1>
      </div>

      <ConceptForm />
    </div>
  )
}
