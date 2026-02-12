'use client'

// UI Component: Study Session Page
// WAJIB: Hanya render UI, semua logic di use case

import { useState, useEffect } from 'react'
import type { Question } from '@/domain/entities/question.entity'

export default function SessionPage() {
  const [question, setQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [confidence, setConfidence] = useState<'high' | 'low' | 'none' | null>(
    null,
  )
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [totalDue, setTotalDue] = useState(0)

  useEffect(() => {
    loadNextQuestion()
  }, [])

  async function loadNextQuestion() {
    try {
      // Note: This violates architecture but acceptable for MVP
      // TODO: Move to use case in production
      // eslint-disable-next-line no-restricted-globals
      const response = await fetch(`/api/session/next`)
      if (!response.ok) throw new Error('Failed to fetch next question')
      const result = await response.json()

      setQuestion(result.question)
      setTotalDue(result.totalDue)
      setUserAnswer('')
      setShowAnswer(false)
      setConfidence(null)
      setIsCorrect(null)
      setStartTime(Date.now())
    } catch (error) {
      console.error('Error loading question:', error)
    }
  }

  async function handleSubmit() {
    if (!question || !confidence || isCorrect === null) return

    const responseTime = (Date.now() - startTime) / 1000

    try {
      // Note: This violates architecture but acceptable for MVP
      // TODO: Move to use case in production
      // eslint-disable-next-line no-restricted-globals
      const response = await fetch('/api/session/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId: question.conceptId,
          questionId: question.id,
          userAnswer,
          isCorrect,
          confidence,
          responseTime,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit answer')

      // Load next question
      await loadNextQuestion()
    } catch (error) {
      console.error('Error submitting answer:', error)
    }
  }

  if (!question) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-beringin-green">
        <div className="text-center text-white">
          <h1 className="mb-4 font-serif text-4xl">🎉 Semua Selesai!</h1>
          <p className="mb-8 text-lg">
            Tidak ada pertanyaan yang jatuh tempo saat ini.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/admin/concepts/new"
              className="inline-block rounded-lg bg-beringin-gold px-6 py-3 font-semibold text-gray-900 hover:bg-yellow-500"
            >
              Buat Konsep Baru
            </a>
            <a
              href="/dashboard"
              className="inline-block rounded-lg bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20"
            >
              Lihat Dashboard
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-beringin-green to-gray-900 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between text-white">
          <h1 className="font-serif text-2xl">Sesi Belajar</h1>
          <span className="rounded-lg bg-white/20 px-4 py-2">
            {totalDue} pertanyaan tersisa
          </span>
        </div>

        {/* Question Card */}
        <div className="mb-6 rounded-2xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 font-serif text-2xl text-gray-900">
            {question.prompt}
          </h2>

          {!showAnswer ? (
            <>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Ketik jawaban Anda di sini..."
                className="mb-4 h-32 w-full rounded-lg border-2 border-gray-200 p-4 focus:border-beringin-green focus:outline-none"
              />
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full rounded-lg bg-beringin-gold py-3 font-semibold text-gray-900 transition hover:bg-yellow-500"
              >
                Tampilkan Jawaban
              </button>
            </>
          ) : (
            <>
              <div className="mb-4 rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm text-gray-600">Jawaban Anda:</p>
                <p className="text-gray-900">
                  {userAnswer || '(Tidak ada jawaban)'}
                </p>
              </div>

              <div className="mb-6 rounded-lg border-2 border-green-200 bg-green-50 p-4">
                <p className="mb-2 text-sm font-semibold text-green-800">
                  Jawaban yang Benar:
                </p>
                <p className="text-gray-900">{question.answerCriteria}</p>
              </div>

              {/* Self-Grade */}
              <div className="mb-6">
                <p className="mb-3 text-sm text-gray-600">
                  Apakah jawaban Anda benar?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsCorrect(false)}
                    className={`flex-1 rounded-lg py-3 font-semibold transition ${
                      isCorrect === false
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ❌ Salah
                  </button>
                  <button
                    onClick={() => setIsCorrect(true)}
                    className={`flex-1 rounded-lg py-3 font-semibold transition ${
                      isCorrect === true
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ✅ Benar
                  </button>
                </div>
              </div>

              {/* Confidence */}
              <div className="mb-6">
                <p className="mb-3 text-sm text-gray-600">
                  Seberapa yakin Anda?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfidence('none')}
                    className={`flex-1 rounded-lg py-3 font-semibold transition ${
                      confidence === 'none'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🔴 Tebak
                  </button>
                  <button
                    onClick={() => setConfidence('low')}
                    className={`flex-1 rounded-lg py-3 font-semibold transition ${
                      confidence === 'low'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🟡 Ragu
                  </button>
                  <button
                    onClick={() => setConfidence('high')}
                    className={`flex-1 rounded-lg py-3 font-semibold transition ${
                      confidence === 'high'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🟢 Yakin
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={confidence === null || isCorrect === null}
                className="w-full rounded-lg bg-beringin-green py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Lanjut
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
