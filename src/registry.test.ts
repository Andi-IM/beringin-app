import { Registry } from '@/registry'

// We need to mock the dynamic imports in Registry
// But strictly speaking, Registry is just a facade.
// However, since we want coverage, we can test it by acting as if we are consuming it.
// The real challenge is that Registry dynamically imports use cases.
// Jest mocks for dynamic imports can be tricky.
//
// Let's try to verify that Registry delegates correctly.

describe('Registry Admin Methods', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_USE_KV_API = 'true'
  })

  afterAll(() => {
    delete process.env.NEXT_PUBLIC_USE_KV_API
  })

  it('should delegate getAllConceptsForUser', async () => {
    const mockRepo = {
      findAllByUserId: jest.fn().mockResolvedValue([]),
    }
    // Mock getRepositories to return our mock repo
    jest.spyOn(Registry, 'getRepositories').mockResolvedValue({
      conceptRepo: mockRepo as any,
      conceptProgressRepo: {} as any,
      questionRepo: {} as any,
      progressRepo: {} as any,
    })

    const concepts = await Registry.getAllConceptsForUser('user-1')
    expect(mockRepo.findAllByUserId).toHaveBeenCalledWith('user-1')
    expect(Array.isArray(concepts)).toBe(true)
  })

  it('should delegate createConcept', async () => {
    const mockRepo = {
      create: jest.fn().mockResolvedValue({ id: '1', title: 'Test' }),
    }
    jest.spyOn(Registry, 'getRepositories').mockResolvedValue({
      conceptRepo: mockRepo as any,
      conceptProgressRepo: {} as any,
      questionRepo: {} as any,
      progressRepo: {} as any,
    })

    const concept = await Registry.createConcept({
      title: 'Test',
      description: 'Desc',
      category: 'Cat',
      userId: 'user-1',
    })
    expect(mockRepo.create).toHaveBeenCalled()
    expect(concept.title).toBe('Test')
  })

  it('should delegate getConceptById', async () => {
    const mockRepo = {
      findById: jest.fn().mockResolvedValue({ id: '1' }),
    }
    jest.spyOn(Registry, 'getRepositories').mockResolvedValue({
      conceptRepo: mockRepo as any,
      conceptProgressRepo: {} as any,
      questionRepo: {} as any,
      progressRepo: {} as any,
    })

    const found = await Registry.getConceptById('1')
    expect(mockRepo.findById).toHaveBeenCalledWith('1')
    expect(found?.id).toBe('1')
  })

  it('should delegate updateConcept', async () => {
    const mockRepo = {
      findById: jest.fn().mockResolvedValue({ id: '1', title: 'Old' }),
      update: jest.fn().mockResolvedValue({ id: '1', title: 'Updated' }),
    }
    jest.spyOn(Registry, 'getRepositories').mockResolvedValue({
      conceptRepo: mockRepo as any,
      conceptProgressRepo: {} as any,
      questionRepo: {} as any,
      progressRepo: {} as any,
    })

    const updated = await Registry.updateConcept('1', {
      title: 'Updated',
    })
    expect(mockRepo.findById).toHaveBeenCalledWith('1')
    expect(mockRepo.update).toHaveBeenCalled()
    expect(updated.title).toBe('Updated')
  })

  it('should delegate deleteConcept', async () => {
    const mockRepo = {
      findById: jest.fn().mockResolvedValue({ id: '1' }),
      delete: jest.fn().mockResolvedValue(undefined),
    }
    jest.spyOn(Registry, 'getRepositories').mockResolvedValue({
      conceptRepo: mockRepo as any,
      conceptProgressRepo: {} as any,
      questionRepo: {} as any,
      progressRepo: {} as any,
    })

    await Registry.deleteConcept('1')
    expect(mockRepo.findById).toHaveBeenCalledWith('1')
    expect(mockRepo.delete).toHaveBeenCalledWith('1')
  })
})
