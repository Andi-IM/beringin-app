import type { Question } from '@/domain/entities/question.entity'
import type { QuestionRepository } from '@/infrastructure/repositories/question.repository'
import {
  getNextQuestion,
  type GetNextQuestionInput,
} from './getNextQuestion.usecase'

describe('getNextQuestion Use Case', () => {
  const mockQuestionRepo: jest.Mocked<QuestionRepository> = {
    findDueQuestions: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByConceptId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the first due question when questions are available', async () => {
    const input: GetNextQuestionInput = {
      userId: 'user-1',
    }

    const mockQuestions: Question[] = [
      {
        id: 'q1',
        conceptId: 'concept-1',
        prompt: 'What is 2+2?',
        answerCriteria: '4',
        type: 'text',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'q2',
        conceptId: 'concept-2',
        prompt: 'What is the capital of France?',
        answerCriteria: 'Paris',
        type: 'text',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
    ]

    mockQuestionRepo.findDueQuestions.mockResolvedValue(mockQuestions)

    const result = await getNextQuestion(input, mockQuestionRepo)

    expect(mockQuestionRepo.findDueQuestions).toHaveBeenCalledWith('user-1')
    expect(result).toEqual({
      question: mockQuestions[0],
      totalDue: 2,
    })
  })

  it('should return null when no due questions are available', async () => {
    const input: GetNextQuestionInput = {
      userId: 'user-empty',
    }

    mockQuestionRepo.findDueQuestions.mockResolvedValue([])

    const result = await getNextQuestion(input, mockQuestionRepo)

    expect(mockQuestionRepo.findDueQuestions).toHaveBeenCalledWith('user-empty')
    expect(result).toEqual({
      question: null,
      totalDue: 0,
    })
  })

  it('should handle single due question correctly', async () => {
    const input: GetNextQuestionInput = {
      userId: 'user-single',
    }

    const mockQuestion: Question = {
      id: 'q-single',
      conceptId: 'concept-single',
      prompt: 'Single question',
      answerCriteria: 'answer',
      type: 'text',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    }

    mockQuestionRepo.findDueQuestions.mockResolvedValue([mockQuestion])

    const result = await getNextQuestion(input, mockQuestionRepo)

    expect(result).toEqual({
      question: mockQuestion,
      totalDue: 1,
    })
  })

  it('should handle different question types', async () => {
    const input: GetNextQuestionInput = {
      userId: 'user-types',
    }

    const mockQuestions: Question[] = [
      {
        id: 'q-voice',
        conceptId: 'concept-voice',
        prompt: 'Say hello',
        answerCriteria: 'hello',
        type: 'voice',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'q-cloze',
        conceptId: 'concept-cloze',
        prompt: 'The sky is ___.',
        answerCriteria: 'blue',
        type: 'cloze',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
    ]

    mockQuestionRepo.findDueQuestions.mockResolvedValue(mockQuestions)

    const result = await getNextQuestion(input, mockQuestionRepo)

    expect(result.question?.type).toBe('voice')
    expect(result.totalDue).toBe(2)
  })

  it('should call repository with correct userId', async () => {
    const input: GetNextQuestionInput = {
      userId: 'specific-user-id',
    }

    mockQuestionRepo.findDueQuestions.mockResolvedValue([])

    await getNextQuestion(input, mockQuestionRepo)

    expect(mockQuestionRepo.findDueQuestions).toHaveBeenCalledTimes(1)
    expect(mockQuestionRepo.findDueQuestions).toHaveBeenCalledWith(
      'specific-user-id',
    )
  })

  it('should return correct total count regardless of question returned', async () => {
    const input: GetNextQuestionInput = {
      userId: 'user-many',
    }

    const mockQuestions: Question[] = Array.from({ length: 10 }, (_, i) => ({
      id: `q-${i}`,
      conceptId: `concept-${i}`,
      prompt: `Question ${i}`,
      answerCriteria: `answer-${i}`,
      type: 'text' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    mockQuestionRepo.findDueQuestions.mockResolvedValue(mockQuestions)

    const result = await getNextQuestion(input, mockQuestionRepo)

    expect(result.question).toBe(mockQuestions[0])
    expect(result.totalDue).toBe(10)
  })
})
