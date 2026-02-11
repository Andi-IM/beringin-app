import { ConceptForm } from '@/app/components/admin/ConceptForm'
import { Registry } from '@/registry'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface EditConceptPageProps {
  params: Promise<{ id: string }>
}

export default async function EditConceptPage({
  params,
}: EditConceptPageProps) {
  const { id } = await params
  const concept = await Registry.getConceptById(id)

  if (!concept) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/concepts"
          className="mb-2 inline-block text-indigo-600 hover:text-indigo-900"
        >
          ← Back to List
        </Link>
        <h1 className="text-2xl font-bold">Edit Concept</h1>
      </div>

      <ConceptForm initialData={concept} />
    </div>
  )
}
