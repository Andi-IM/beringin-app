'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { deleteConceptAction } from '@/app/admin/concepts/actions'
import type { Concept } from '@/domain/entities/concept.entity'

interface ConceptTableProps {
  concepts: Concept[]
}

export function ConceptTable({ concepts }: ConceptTableProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this concept?')) {
      return
    }

    startTransition(async () => {
      try {
        await deleteConceptAction(id)
      } catch (error) {
        console.error('Failed to delete', error)
        alert('Failed to delete concept')
      }
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 bg-white">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Created At
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {concepts.map((concept) => (
            <tr key={concept.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {concept.title}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {concept.category}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {new Date(concept.createdAt).toLocaleDateString()}
              </td>
              <td className="space-x-2 whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <Link
                  href={`/admin/concepts/${concept.id}/edit`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(concept.id)}
                  disabled={isPending}
                  className="ml-4 text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  {isPending ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
          {concepts.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                No concepts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
