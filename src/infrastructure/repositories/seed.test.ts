import { seedData } from './seed'
import {
  conceptRepository,
  questionRepository,
  progressRepository,
  resetAllRepositories,
} from './in-memory.repository'

// Mock console.log to avoid test output pollution
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation()

describe('seedData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear all repositories before each test
    resetAllRepositories()
  })

  afterEach(() => {
    // Clean up after each test
    resetAllRepositories()
  })

  afterAll(() => {
    mockConsoleLog.mockRestore()
  })

  it('should create concepts successfully', async () => {
    await seedData()

    const allConcepts = await conceptRepository.findAll()
    expect(allConcepts).toHaveLength(3)

    // Check specific concepts were created
    const tcpConcept = allConcepts.find((c) => c.title === 'TCP Handshake')
    expect(tcpConcept).toBeDefined()
    expect(tcpConcept?.category).toBe('Networking')
    expect(tcpConcept?.description).toBe(
      'Proses koneksi tiga langkah dalam protokol TCP',
    )

    const pancasilaConcept = allConcepts.find(
      (c) => c.title === 'Pancasila Sila 4',
    )
    expect(pancasilaConcept).toBeDefined()
    expect(pancasilaConcept?.category).toBe('Wawasan Kebangsaan')

    const ddosConcept = allConcepts.find((c) => c.title === 'DDoS Attack')
    expect(ddosConcept).toBeDefined()
    expect(ddosConcept?.category).toBe('Security')
  })

  it('should create questions for each concept', async () => {
    await seedData()

    const allQuestions = await questionRepository.findAll()
    expect(allQuestions).toHaveLength(3)

    // Check questions are linked to concepts
    const concepts = await conceptRepository.findAll()
    const tcpConcept = concepts.find((c) => c.title === 'TCP Handshake')
    const pancasilaConcept = concepts.find(
      (c) => c.title === 'Pancasila Sila 4',
    )
    const ddosConcept = concepts.find((c) => c.title === 'DDoS Attack')

    const tcpQuestion = allQuestions.find(
      (q: any) => q.conceptId === tcpConcept?.id,
    )
    expect(tcpQuestion).toBeDefined()
    expect(tcpQuestion?.prompt).toBe('Jelaskan 3 langkah dalam TCP handshake')
    expect(tcpQuestion?.answerCriteria).toBe('SYN, SYN-ACK, ACK')
    expect(tcpQuestion?.type).toBe('text')

    const pancasilaQuestion = allQuestions.find(
      (q: any) => q.conceptId === pancasilaConcept?.id,
    )
    expect(pancasilaQuestion).toBeDefined()
    expect(pancasilaQuestion?.prompt).toBe(
      'Apa inti dari penerapan Sila ke-4 dalam pengambilan keputusan?',
    )

    const ddosQuestion = allQuestions.find(
      (q: any) => q.conceptId === ddosConcept?.id,
    )
    expect(ddosQuestion).toBeDefined()
    expect(ddosQuestion?.prompt).toBe(
      'Apa perbedaan utama antara DoS dan DDoS?',
    )
  })

  it('should create initial progress for demo-user', async () => {
    await seedData()

    const userProgress = await progressRepository.findByUserId('demo-user')
    expect(userProgress).toHaveLength(3)

    // Check progress properties
    userProgress.forEach((progress) => {
      expect(progress.userId).toBe('demo-user')
      expect(progress.status).toBe('new')
      expect(progress.lastInterval).toBe(0.007)
      expect(progress.easeFactor).toBe(2.5)
      expect(progress.history).toEqual([])
      expect(progress.nextReview).toBeInstanceOf(Date)
    })

    // Check that progress is linked to concepts
    const concepts = await conceptRepository.findAll()
    const conceptIds = concepts.map((c) => c.id)
    const progressConceptIds = userProgress.map((p) => p.conceptId)

    expect(progressConceptIds.sort()).toEqual(conceptIds.sort())
  })

  it('should create progress with nextReview set to current time', async () => {
    const beforeSeed = new Date()
    await seedData()
    const afterSeed = new Date()

    const userProgress = await progressRepository.findByUserId('demo-user')

    userProgress.forEach((progress) => {
      expect(progress.nextReview.getTime()).toBeGreaterThanOrEqual(
        beforeSeed.getTime(),
      )
      expect(progress.nextReview.getTime()).toBeLessThanOrEqual(
        afterSeed.getTime(),
      )
    })
  })

  it('should log success message', async () => {
    await seedData()

    expect(mockConsoleLog).toHaveBeenCalledWith(
      '✅ Seed data created successfully!',
    )
  })

  it('should create concepts with proper structure', async () => {
    await seedData()

    const concepts = await conceptRepository.findAll()

    concepts.forEach((concept) => {
      expect(concept.id).toBeDefined()
      expect(concept.id).toMatch(/^[a-z0-9]+$/)
      expect(concept.title).toBeDefined()
      expect(concept.description).toBeDefined()
      expect(concept.category).toBeDefined()
      expect(concept.createdAt).toBeInstanceOf(Date)
      expect(concept.updatedAt).toBeInstanceOf(Date)
    })
  })

  it('should create questions with proper structure', async () => {
    await seedData()

    const questions = await questionRepository.findAll()

    questions.forEach((question: any) => {
      expect(question.id).toBeDefined()
      expect(question.id).toMatch(/^[a-z0-9]+$/)
      expect(question.conceptId).toBeDefined()
      expect(question.prompt).toBeDefined()
      expect(question.answerCriteria).toBeDefined()
      expect(question.type).toBe('text')
      expect(question.createdAt).toBeInstanceOf(Date)
      expect(question.updatedAt).toBeInstanceOf(Date)
    })
  })

  it('should create progress with proper structure', async () => {
    await seedData()

    const userProgress = await progressRepository.findByUserId('demo-user')

    userProgress.forEach((progress) => {
      expect(progress.userId).toBe('demo-user')
      expect(progress.conceptId).toBeDefined()
      expect(progress.status).toBe('new')
      expect(progress.nextReview).toBeInstanceOf(Date)
      expect(progress.lastInterval).toBe(0.007)
      expect(progress.easeFactor).toBe(2.5)
      expect(Array.isArray(progress.history)).toBe(true)
      expect(progress.history).toHaveLength(0)
      expect(progress.createdAt).toBeInstanceOf(Date)
      expect(progress.updatedAt).toBeInstanceOf(Date)
    })
  })

  it('should handle seeding data multiple times', async () => {
    // Seed data first time
    await seedData()
    const firstConcepts = await conceptRepository.findAll()
    const firstQuestions = await questionRepository.findAll()
    const firstProgress = await progressRepository.findByUserId('demo-user')

    // Seed data second time
    await seedData()
    const secondConcepts = await conceptRepository.findAll()
    const secondQuestions = await questionRepository.findAll()
    const secondProgress = await progressRepository.findByUserId('demo-user')

    // Should have double the data (since we're using in-memory store)
    expect(secondConcepts).toHaveLength(firstConcepts.length * 2)
    expect(secondQuestions).toHaveLength(firstQuestions.length * 2)
    expect(secondProgress).toHaveLength(firstProgress.length * 2)
  })

  it('should maintain referential integrity between concepts and questions', async () => {
    await seedData()

    const concepts = await conceptRepository.findAll()
    const questions = await questionRepository.findAll()

    // Every question should reference a valid concept
    const conceptIds = new Set(concepts.map((c) => c.id))

    questions.forEach((question: any) => {
      expect(conceptIds.has(question.conceptId)).toBe(true)
    })
  })

  it('should maintain referential integrity between concepts and progress', async () => {
    await seedData()

    const concepts = await conceptRepository.findAll()
    const userProgress = await progressRepository.findByUserId('demo-user')

    // Every progress should reference a valid concept
    const conceptIds = new Set(concepts.map((c) => c.id))

    userProgress.forEach((progress) => {
      expect(conceptIds.has(progress.conceptId)).toBe(true)
    })
  })
})
