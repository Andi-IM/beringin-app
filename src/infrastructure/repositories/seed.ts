// Seed data for MVP testing
// Run this to populate database with sample content

import type { ConceptRepository } from './concept.repository'
import type { QuestionRepository } from './question.repository'
import type { ProgressRepository } from './progress.repository'

export async function seedData(repos: {
  conceptRepo: ConceptRepository
  questionRepo: QuestionRepository
  progressRepo: ProgressRepository
}) {
  const { conceptRepo, questionRepo, progressRepo } = repos

  // Create concepts
  const userId = 'demo-user'
  const concept1 = await conceptRepo.create({
    userId,
    title: 'TCP Handshake',
    description: 'Proses koneksi tiga langkah dalam protokol TCP',
    category: 'Networking',
  })

  const concept2 = await conceptRepo.create({
    userId,
    title: 'Pancasila Sila 4',
    description:
      'Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan',
    category: 'Wawasan Kebangsaan',
  })

  const concept3 = await conceptRepo.create({
    userId,
    title: 'DDoS Attack',
    description: 'Distributed Denial of Service - serangan dari banyak sumber',
    category: 'Security',
  })

  // Create questions
  await questionRepo.create({
    conceptId: concept1.id,
    prompt: 'Jelaskan 3 langkah dalam TCP handshake',
    answerCriteria: 'SYN, SYN-ACK, ACK',
    type: 'text',
  })

  await questionRepo.create({
    conceptId: concept2.id,
    prompt: 'Apa inti dari penerapan Sila ke-4 dalam pengambilan keputusan?',
    answerCriteria: 'Musyawarah, Mufakat, Perwakilan, Kebijaksanaan',
    type: 'text',
  })

  await questionRepo.create({
    conceptId: concept3.id,
    prompt: 'Apa perbedaan utama antara DoS dan DDoS?',
    answerCriteria: 'DoS satu sumber, DDoS banyak sumber (distributed)',
    type: 'text',
  })

  // Create initial progress (all due now for testing)
  // const userId = 'demo-user' // Moved up
  const now = new Date()

  await progressRepo.create({
    userId,
    conceptId: concept1.id,
    status: 'new',
    nextReview: now,
    lastInterval: 0.007,
    easeFactor: 2.5,
    history: [],
  })

  await progressRepo.create({
    userId,
    conceptId: concept2.id,
    status: 'new',
    nextReview: now,
    lastInterval: 0.007,
    easeFactor: 2.5,
    history: [],
  })

  await progressRepo.create({
    userId,
    conceptId: concept3.id,
    status: 'new',
    nextReview: now,
    lastInterval: 0.007,
    easeFactor: 2.5,
    history: [],
  })

  console.log('✅ Seed data created successfully!')
}
