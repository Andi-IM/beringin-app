// Domain Entity: Question
// Pure business logic - no framework dependencies

export type QuestionType = 'text' | 'voice' | 'cloze'

export interface Question {
  id: string
  conceptId: string
  prompt: string
  answerCriteria: string // Keywords or patterns for correctness
  type: QuestionType
  createdAt: Date
  updatedAt: Date
}

export interface QuestionWithAnswer extends Question {
  userAnswer?: string
  isCorrect?: boolean
  confidence?: 'high' | 'low' | 'none'
  responseTime?: number // in seconds
}
