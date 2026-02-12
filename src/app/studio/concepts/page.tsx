import Link from 'next/link'
import { Registry } from '@/registry'
import { ConceptTable } from '@/app/components/admin/ConceptTable'

import { createClient } from '@/infrastructure/auth/supabase-client'
import { redirect } from 'next/navigation'

export default async function ConceptsListPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const concepts = await Registry.getAllConceptsForUser(user.id)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Konsep</h1>
        <Link
          href="/studio/concepts/new"
          className="rounded bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
        >
          Create Concept
        </Link>
      </div>

      <ConceptTable concepts={concepts} />
    </div>
  )
}
