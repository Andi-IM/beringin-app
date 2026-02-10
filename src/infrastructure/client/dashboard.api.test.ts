import { DashboardApi } from './dashboard.api'

describe('DashboardApi', () => {
  const mockFetch = jest.fn()
  global.fetch = mockFetch

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns dashboard data on successful fetch', async () => {
    const mockData = {
      concepts: [],
      stats: { total: 0, stable: 0, fragile: 0, learning: 0, lapsed: 0 },
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    const result = await DashboardApi.getDashboardData()
    expect(result).toEqual(mockData)
    expect(mockFetch).toHaveBeenCalledWith('/api/dashboard')
  })

  it('throws error when fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    })

    await expect(DashboardApi.getDashboardData()).rejects.toThrow(
      'Failed to fetch dashboard data',
    )
  })
})
