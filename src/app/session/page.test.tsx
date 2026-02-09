'use client'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SessionPage from './page'

// Mock use cases and repositories
jest.mock('@/application/usecases/getNextQuestion.usecase')
jest.mock('@/application/usecases/submitAnswer.usecase')
jest.mock('@/infrastructure/repositories/in-memory.repository')

const mockGetNextQuestion = require('@/application/usecases/getNextQuestion.usecase').getNextQuestion
const mockSubmitAnswer = require('@/application/usecases/submitAnswer.usecase').submitAnswer
const mockQuestionRepository = require('@/infrastructure/repositories/in-memory.repository').questionRepository
const mockProgressRepository = require('@/infrastructure/repositories/in-memory.repository').progressRepository

describe('SessionPage', () => {
  const mockQuestion = {
    id: 'q1',
    conceptId: 'concept-1',
    prompt: 'What is 2+2?',
    answerCriteria: '4',
    type: 'text' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Date, 'now').mockReturnValue(1000000000000)
    
    mockGetNextQuestion.mockResolvedValue({
      question: mockQuestion,
      totalDue: 5,
    })
    
    mockSubmitAnswer.mockResolvedValue({
      nextReviewDate: new Date(),
      newStatus: 'learning',
      intervalDays: 1,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders session page with question', async () => {
    render(<SessionPage />)
    
    await waitFor(() => {
      expect(screen.getByText('What is 2+2?')).toBeInTheDocument()
      expect(screen.getByText('5 pertanyaan tersisa')).toBeInTheDocument()
    })
  })

  it('renders completion state when no questions available', async () => {
    mockGetNextQuestion.mockResolvedValue({
      question: null,
      totalDue: 0,
    })

    render(<SessionPage />)
    
    await waitFor(() => {
      expect(screen.getByText('🎉 Semua Selesai!')).toBeInTheDocument()
      expect(screen.getByText('Tidak ada pertanyaan yang jatuh tempo saat ini.')).toBeInTheDocument()
      expect(screen.getByText('Lihat Dashboard')).toBeInTheDocument()
    })
  })

  it('allows user to type answer', async () => {
    const user = userEvent.setup()
    render(<SessionPage />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ketik jawaban Anda di sini...')).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText('Ketik jawaban Anda di sini...')
    await user.type(textarea, 'My answer')
    
    expect(textarea).toHaveValue('My answer')
  })

  it('shows answer section when user clicks show answer', async () => {
    const user = userEvent.setup()
    render(<SessionPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Tampilkan Jawaban')).toBeInTheDocument()
    })

    const showButton = screen.getByText('Tampilkan Jawaban')
    await user.click(showButton)
    
    expect(screen.getByText('Jawaban Anda:')).toBeInTheDocument()
    expect(screen.getByText('Jawaban yang Benar:')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('allows user to select correctness', async () => {
    const user = userEvent.setup()
    render(<SessionPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Tampilkan Jawaban')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Tampilkan Jawaban'))
    
    const correctButton = screen.getByText('✅ Benar')
    await user.click(correctButton)
    
    expect(correctButton).toHaveClass('bg-green-500', 'text-white')
    
    const incorrectButton = screen.getByText('❌ Salah')
    await user.click(incorrectButton)
    
    expect(incorrectButton).toHaveClass('bg-red-500', 'text-white')
    expect(correctButton).not.toHaveClass('bg-green-500', 'text-white')
  })

  it('allows user to select confidence level', async () => {
    const user = userEvent.setup()
    render(<SessionPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Tampilkan Jawaban')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Tampilkan Jawaban'))
    
    // Test high confidence
    const highButton = screen.getByText('🟢 Yakin')
    await user.click(highButton)
    expect(highButton).toHaveClass('bg-green-500', 'text-white')
    
    // Test low confidence
    const lowButton = screen.getByText('🟡 Ragu')
    await user.click(lowButton)
    expect(lowButton).toHaveClass('bg-yellow-500', 'text-white')
    expect(highButton).not.toHaveClass('bg-green-500', 'text-white')
    
    // Test no confidence
    const noneButton = screen.getByText('🔴 Tebak')
    await user.click(noneButton)
    expect(noneButton).toHaveClass('bg-red-500', 'text-white')
    expect(lowButton).not.toHaveClass('bg-yellow-500', 'text-white')
  })

  it('enables submit button only when correctness and confidence are selected', async () => {
    const user = userEvent.setup()
    render(<SessionPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Tampilkan Jawaban')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Tampilkan Jawaban'))
    
    const submitButton = screen.getByText('Lanjut')
    expect(submitButton).toBeDisabled()
    
    // Select correctness only
    await user.click(screen.getByText('✅ Benar'))
    expect(submitButton).toBeDisabled()
    
    // Select confidence
    await user.click(screen.getByText('🟢 Yakin'))
    expect(submitButton).toBeEnabled()
    
    // Deselect confidence
    await user.click(screen.getByText('🟡 Ragu'))
    expect(submitButton).toBeDisabled()
  })

  it('submits answer and loads next question', async () => {
    const user = userEvent.setup()
    
    // Mock second question
    const mockSecondQuestion = {
      ...mockQuestion,
      id: 'q2',
      prompt: 'What is 3+3?',
    }
    
    mockGetNextQuestion
      .mockResolvedValueOnce({ question: mockQuestion, totalDue: 2 })
      .mockResolvedValueOnce({ question: mockSecondQuestion, totalDue: 1 })

    render(<SessionPage />)
    
    await waitFor(() => {
      expect(screen.getByText('What is 2+2?')).toBeInTheDocument()
    })

    // Complete first question
    await user.click(screen.getByText('Tampilkan Jawaban'))
    await user.click(screen.getByText('✅ Benar'))
    await user.click(screen.getByText('🟢 Yakin'))
    await user.click(screen.getByText('Lanjut'))

    // Verify submit was called
    await waitFor(() => {
      expect(mockSubmitAnswer).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'demo-user',
          conceptId: 'concept-1',
          questionId: 'q1',
          userAnswer: '',
          isCorrect: true,
          confidence: 'high',
          responseTime: 0,
        }),
        mockProgressRepository
      )
    })

    // Verify next question loads
    await waitFor(() => {
      expect(screen.getByText('What is 3+3?')).toBeInTheDocument()
      expect(screen.getByText('1 pertanyaan tersisa')).toBeInTheDocument()
    })
  })

  it('handles empty answer correctly', async () => {
    const user = userEvent.setup()
    render(<SessionPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Tampilkan Jawaban')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Tampilkan Jawaban'))
    
    expect(screen.getByText('(Tidak ada jawaban)')).toBeInTheDocument()
  })

  it('calculates response time correctly', async () => {
    const user = userEvent.setup()
    
    // Mock time progression
    const mockTime = jest.spyOn(Date, 'now')
      .mockReturnValueOnce(1000000000000) // Start time
      .mockReturnValueOnce(1000000015000) // 15 seconds later

    render(<SessionPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Tampilkan Jawaban')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Tampilkan Jawaban'))
    await user.click(screen.getByText('✅ Benar'))
    await user.click(screen.getByText('🟢 Yakin'))
    await user.click(screen.getByText('Lanjut'))

    await waitFor(() => {
      expect(mockSubmitAnswer).toHaveBeenCalledWith(
        expect.objectContaining({
          responseTime: 15,
        }),
        mockProgressRepository
      )
    })

    mockTime.mockRestore()
  })

  it('handles different question types', async () => {
    const voiceQuestion = { ...mockQuestion, type: 'voice' as const }
    const clozeQuestion = { ...mockQuestion, type: 'cloze' as const }

    mockGetNextQuestion
      .mockResolvedValueOnce({ question: voiceQuestion, totalDue: 1 })
      .mockResolvedValueOnce({ question: clozeQuestion, totalDue: 1 })

    // Test voice question
    const { rerender } = render(<SessionPage />)
    
    await waitFor(() => {
      expect(screen.getByText('What is 2+2?')).toBeInTheDocument()
    })

    // Test cloze question
    mockGetNextQuestion.mockResolvedValueOnce({ question: clozeQuestion, totalDue: 0 })
    rerender(<SessionPage />)
    
    await waitFor(() => {
      expect(screen.getByText('What is 2+2?')).toBeInTheDocument()
    })
  })

  it('handles submit when no correctness selected', async () => {
    const user = userEvent.setup()
    render(<SessionPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Tampilkan Jawaban')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Tampilkan Jawaban'))
    await user.click(screen.getByText('🟢 Yakin'))
    
    const submitButton = screen.getByText('Lanjut')
    await user.click(submitButton)
    
    // Should not submit since correctness is not selected
    expect(mockSubmitAnswer).not.toHaveBeenCalled()
  })

  it('handles submit when no confidence selected', async () => {
    const user = userEvent.setup()
    render(<SessionPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Tampilkan Jawaban')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Tampilkan Jawaban'))
    await user.click(screen.getByText('✅ Benar'))
    
    const submitButton = screen.getByText('Lanjut')
    await user.click(submitButton)
    
    // Should not submit since confidence is not selected
    expect(mockSubmitAnswer).not.toHaveBeenCalled()
  })
})