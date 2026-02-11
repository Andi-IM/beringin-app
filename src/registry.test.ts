import { Registry } from '@/registry'
import { InMemoryConceptRepository } from '@/infrastructure/repositories/in-memory.repository'

// We need to mock the dynamic imports in Registry
// But strictly speaking, Registry is just a facade.
// However, since we want coverage, we can test it by acting as if we are consuming it.
// The real challenge is that Registry dynamically imports use cases.
// Jest mocks for dynamic imports can be tricky.
//
// Let's try to verify that Registry delegates correctly.

describe('Registry Admin Methods', () => {
  // Since Registry uses Singletons and internal state, we should be careful.
  // Actually, Registry returns promises.

  it('should delegate getAllConcepts', async () => {
    const concepts = await Registry.getAllConcepts()
    expect(Array.isArray(concepts)).toBe(true)
  })

  it('should delegate createConcept', async () => {
    const concept = await Registry.createConcept({
      title: 'Test',
      description: 'Desc',
      category: 'Cat',
    })
    expect(concept.title).toBe('Test')
  })

  it('should delegate getConceptById', async () => {
    const created = await Registry.createConcept({
      title: 'To Get',
      description: 'Desc',
      category: 'Cat',
    })
    const found = await Registry.getConceptById(created.id)
    expect(found?.id).toBe(created.id)
  })

  it('should delegate updateConcept', async () => {
    const created = await Registry.createConcept({
      title: 'To Update',
      description: 'Desc',
      category: 'Cat',
    })
    const updated = await Registry.updateConcept(created.id, {
      title: 'Updated',
    })
    expect(updated.title).toBe('Updated')
  })

  it('should delegate deleteConcept', async () => {
    const created = await Registry.createConcept({
      title: 'To Delete',
      description: 'Desc',
      category: 'Cat',
    })
    await Registry.deleteConcept(created.id)
    const found = await Registry.getConceptById(created.id)
    expect(found).toBeNull()
  })
})
