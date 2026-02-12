import { ConceptRepository } from '@/infrastructure/repositories/concept.repository'
import { QuestionRepository } from '@/infrastructure/repositories/question.repository'

export async function seedInitialData(
  userId: string,
  conceptRepo: ConceptRepository,
  questionRepo: QuestionRepository,
): Promise<void> {
  // 1. Create Default Concept
  const concept = await conceptRepo.create({
    title: '🌿 Selamat Datang di Beringin',
    description:
      'Konsep pertama Anda: Memahami Active Recall & Spaced Repetition.',
    category: 'Onboarding',
  })

  const conceptId = concept.id

  // 2. Create Default Question
  await questionRepo.create({
    conceptId: conceptId,
    prompt: 'Apa kunci utama agar ingatan menjadi permanen di Beringin?',
    answerCriteria:
      'Active Recall (Ucapkan Lantang) dan Spaced Repetition (Jeda Waktu)',
    type: 'basic',
  })

  // 3. Initialize Progress (Optional, scheduler handles it, but good to be explicit)
  // For now let the scheduler handle it when user starts session
}
