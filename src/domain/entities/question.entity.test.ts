import { QuestionType, Question, QuestionWithAnswer } from './question.entity'

describe('Question Entity', () => {
  describe('Question Type', () => {
    it('should create a valid text question', () => {
      const question: Question = {
        id: 'q1',
        conceptId: 'concept-1',
        prompt: 'What is 2+2?',
        answerCriteria: '4',
        type: 'text',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      expect(question.id).toBe('q1')
      expect(question.conceptId).toBe('concept-1')
      expect(question.prompt).toBe('What is 2+2?')
      expect(question.answerCriteria).toBe('4')
      expect(question.type).toBe('text')
      expect(question.createdAt).toEqual(new Date('2024-01-01'))
      expect(question.updatedAt).toEqual(new Date('2024-01-01'))
    })

    it('should create a valid voice question', () => {
      const question: Question = {
        id: 'q2',
        conceptId: 'concept-2',
        prompt: 'Say "hello" in English',
        answerCriteria: 'hello',
        type: 'voice',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      }

      expect(question.type).toBe('voice')
    })

    it('should create a valid cloze question', () => {
      const question: Question = {
        id: 'q3',
        conceptId: 'concept-3',
        prompt: 'The capital of France is ___.',
        answerCriteria: 'Paris',
        type: 'cloze',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      }

      expect(question.type).toBe('cloze')
    })
  })

  describe('QuestionWithAnswer Type', () => {
    it('should create a question with complete answer information', () => {
      const questionWithAnswer: QuestionWithAnswer = {
        id: 'q4',
        conceptId: 'concept-4',
        prompt: 'What is the capital of Japan?',
        answerCriteria: 'Tokyo',
        type: 'text',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        userAnswer: 'Tokyo',
        isCorrect: true,
        confidence: 'high',
        responseTime: 15,
      }

      expect(questionWithAnswer.userAnswer).toBe('Tokyo')
      expect(questionWithAnswer.isCorrect).toBe(true)
      expect(questionWithAnswer.confidence).toBe('high')
      expect(questionWithAnswer.responseTime).toBe(15)
    })

    it('should create a question without optional answer fields', () => {
      const questionWithAnswer: QuestionWithAnswer = {
        id: 'q5',
        conceptId: 'concept-5',
        prompt: 'Unanswered question',
        answerCriteria: 'answer',
        type: 'text',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      expect(questionWithAnswer.userAnswer).toBeUndefined()
      expect(questionWithAnswer.isCorrect).toBeUndefined()
      expect(questionWithAnswer.confidence).toBeUndefined()
      expect(questionWithAnswer.responseTime).toBeUndefined()
    })

    it('should create a question with incorrect answer', () => {
      const questionWithAnswer: QuestionWithAnswer = {
        id: 'q6',
        conceptId: 'concept-6',
        prompt: 'What is 2+2?',
        answerCriteria: '4',
        type: 'text',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        userAnswer: '5',
        isCorrect: false,
        confidence: 'low',
        responseTime: 30,
      }

      expect(questionWithAnswer.isCorrect).toBe(false)
      expect(questionWithAnswer.confidence).toBe('low')
    })
  })

  describe('QuestionType Type', () => {
    it('should accept all valid question types', () => {
      const validTypes: QuestionType[] = ['text', 'voice', 'cloze']

      validTypes.forEach(type => {
        const question: Question = {
          id: `q-${type}`,
          conceptId: 'concept-test',
          prompt: `Test ${type} question`,
          answerCriteria: 'test',
          type,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        expect(question.type).toBe(type)
      })
    })
  })
})