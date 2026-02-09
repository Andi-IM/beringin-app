'use client'

// UI Component: Study Session Page
// WAJIB: Hanya render UI, semua logic di use case

import { useState, useEffect } from 'react'
import { getNextQuestion } from '@/application/usecases/getNextQuestion.usecase'
import { submitAnswer } from '@/application/usecases/submitAnswer.usecase'
import { questionRepository, progressRepository } from '@/infrastructure/repositories/in-memory.repository'
import type { Question } from '@/domain/entities/question.entity'

export default function SessionPage() {
  const [question, setQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [confidence, setConfidence] = useState<'high' | 'low' | 'none' | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [totalDue, setTotalDue] = useState(0)

  const userId = 'demo-user' // Hardcoded for MVP

  useEffect(() => {
    loadNextQuestion()
  }, [])

  async function loadNextQuestion() {
    const result = await getNextQuestion({ userId }, questionRepository)
    setQuestion(result.question)
    setTotalDue(result.totalDue)
    setUserAnswer('')
    setShowAnswer(false)
    setConfidence(null)
    setIsCorrect(null)
    setStartTime(Date.now())
  }

  async function handleSubmit() {
    if (!question || !confidence || isCorrect === null) return

    const responseTime = (Date.now() - startTime) / 1000

    await submitAnswer(
      {
        userId,
        conceptId: question.conceptId,
        questionId: question.id,
        userAnswer,
        isCorrect,
        confidence,
        responseTime,
      },
      progressRepository
    )

    // Load next question
    await loadNextQuestion()
  }

  if (!question) {
    return (
      <main className="min-h-screen bg-beringin-green flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-serif mb-4">🎉 Semua Selesai!</h1>
          <p className="text-lg mb-8">Tidak ada pertanyaan yang jatuh tempo saat ini.</p>
          <a href="/dashboard" className="inline-block bg-beringin-gold text-gray-900 px-6 py-3 rounded-lg font-semibold">
            Lihat Dashboard
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-beringin-green to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-white mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-serif">Sesi Belajar</h1>
          <span className="bg-white/20 px-4 py-2 rounded-lg">
            {totalDue} pertanyaan tersisa
          </span>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-serif text-gray-900 mb-6">
            {question.prompt}
          </h2>

          {!showAnswer ? (
            <>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Ketik jawaban Anda di sini..."
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-beringin-green focus:outline-none mb-4"
              />
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full bg-beringin-gold text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
              >
                Tampilkan Jawaban
              </button>
            </>
          ) : (
            <>
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Jawaban Anda:</p>
                <p className="text-gray-900">{userAnswer || '(Tidak ada jawaban)'}</p>
              </div>

              <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <p className="text-sm text-green-800 mb-2 font-semibold">Jawaban yang Benar:</p>
                <p className="text-gray-900">{question.answerCriteria}</p>
              </div>

              {/* Self-Grade */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Apakah jawaban Anda benar?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsCorrect(false)}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      isCorrect === false
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ❌ Salah
                  </button>
                  <button
                    onClick={() => setIsCorrect(true)}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
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
                <p className="text-sm text-gray-600 mb-3">Seberapa yakin Anda?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfidence('none')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      confidence === 'none'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🔴 Tebak
                  </button>
                  <button
                    onClick={() => setConfidence('low')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      confidence === 'low'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🟡 Ragu
                  </button>
                  <button
                    onClick={() => setConfidence('high')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
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
                className="w-full bg-beringin-green text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
