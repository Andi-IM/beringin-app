import type { ConceptWithStatus } from '@/domain/entities/concept.entity'

export interface DashboardData {
  concepts: ConceptWithStatus[]
  stats: {
    total: number
    stable: number
    fragile: number
    learning: number
    lapsed: number
  }
}

export const DashboardApi = {
  async getDashboardData(): Promise<DashboardData> {
    const response = await fetch('/api/dashboard')
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data')
    }
    return response.json()
  },
}
