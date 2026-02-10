// Seed data for MVP testing
// Run this to populate in-memory database with sample content

import {
  conceptRepository,
  questionRepository,
  progressRepository,
} from './in-memory.repository'

export async function seedData() {
  // Create concepts
  const concept1 = await conceptRepository.create({
    title: 'TCP Handshake',
    description: 'Proses koneksi tiga langkah dalam protokol TCP',
    category: 'Networking',
  })

  const concept2 = await conceptRepository.create({
    title: 'Pancasila Sila 4',
    description:
      'Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan',
    category: 'Wawasan Kebangsaan',
  })

  const concept3 = await conceptRepository.create({
    title: 'DDoS Attack',
    description: 'Distributed Denial of Service - serangan dari banyak sumber',
    category: 'Security',
  })

  // Create questions
  await questionRepository.create({
    conceptId: concept1.id,
    prompt: 'Jelaskan 3 langkah dalam TCP handshake',
    answerCriteria: 'SYN, SYN-ACK, ACK',
    type: 'text',
  })

  await questionRepository.create({
    conceptId: concept2.id,
    prompt: 'Apa inti dari penerapan Sila ke-4 dalam pengambilan keputusan?',
    answerCriteria: 'Musyawarah, Mufakat, Perwakilan, Kebijaksanaan',
    type: 'text',
  })

  await questionRepository.create({
    conceptId: concept3.id,
    prompt: 'Apa perbedaan utama antara DoS dan DDoS?',
    answerCriteria: 'DoS satu sumber, DDoS banyak sumber (distributed)',
    type: 'text',
  })

  // Create initial progress (all due now for testing)
  const userId = 'demo-user'
  const now = new Date()

  await progressRepository.create({
    userId,
    conceptId: concept1.id,
    status: 'new',
    nextReview: now,
    lastInterval: 0.007,
    easeFactor: 2.5,
    history: [],
  })

  await progressRepository.create({
    userId,
    conceptId: concept2.id,
    status: 'new',
    nextReview: now,
    lastInterval: 0.007,
    easeFactor: 2.5,
    history: [],
  })

  await progressRepository.create({
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
