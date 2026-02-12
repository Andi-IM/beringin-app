'use client'

import { useState } from 'react'
import type { Question } from '@/domain/entities/question.entity'
import {
  createQuestionAction,
  deleteQuestionAction,
} from '@/app/admin/questions/actions'
import { logger } from '@/lib/logger'

interface QuestionListProps {
  conceptId: string
  questions: Question[]
}

export function QuestionList({ conceptId, questions }: QuestionListProps) {
  const [isAdding, setIsAdding] = useState(false)

  return (
    <div className="mt-8 rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
        >
          {isAdding ? 'Cancel' : 'Add Question'}
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 rounded-md border bg-gray-50 p-4">
          <form
            action={async (formData) => {
              try {
                await createQuestionAction(formData)
                setIsAdding(false)
              } catch (e) {
                logger.error('Failed to create question', e)
                alert('Failed to create question')
              }
            }}
            className="space-y-4"
          >
            <input type="hidden" name="conceptId" value={conceptId} />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prompt
              </label>
              <input
                name="prompt"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="What is the capital of Indonesia?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Answer Criteria
              </label>
              <textarea
                name="answerCriteria"
                required
                rows={2}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Jakarta"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
              >
                Save Question
              </button>
            </div>
          </form>
        </div>
      )}

      <ul className="divide-y divide-gray-200">
        {questions.map((q) => (
          <li key={q.id} className="flex justify-between py-4">
            <div>
              <p className="font-medium text-gray-900">{q.prompt}</p>
              <p className="text-sm text-gray-500">{q.answerCriteria}</p>
            </div>
            <button
              onClick={async () => {
                if (confirm('Delete this question?')) {
                  await deleteQuestionAction(q.id, conceptId)
                }
              }}
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </li>
        ))}
        {questions.length === 0 && !isAdding && (
          <p className="py-4 text-center text-gray-500">No questions yet.</p>
        )}
      </ul>
    </div>
  )
}
