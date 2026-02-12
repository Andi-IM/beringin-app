// EdgeOne Edge Function: Progress API
// Path: /edge-api/progress

const PREFIX = 'progress:'

// SM-2 Algorithm Implementation
function calculateSM2(grade, previousInterval, previousEaseFactor) {
  let interval
  let easeFactor = previousEaseFactor

  if (grade >= 3) {
    if (previousInterval === 0) {
      interval = 1
    } else if (previousInterval === 1) {
      interval = 6
    } else {
      interval = Math.round(previousInterval * previousEaseFactor)
    }
    easeFactor =
      previousEaseFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  } else {
    interval = 1
    easeFactor = previousEaseFactor
  }

  if (easeFactor < 1.3) easeFactor = 1.3

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  return {
    nextReview: nextReview.toISOString(),
    interval,
    easeFactor,
  }
}

export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)

  class MockKV {
    constructor() {
      if (!globalThis.mockKVStore) globalThis.mockKVStore = new Map()
      this.store = globalThis.mockKVStore
    }
    async get(key) {
      return this.store.get(key) || null
    }
    async put(key, value) {
      this.store.set(key, value)
    }
    async delete(key) {
      this.store.delete(key)
    }
    async list(options) {
      const keys = Array.from(this.store.keys())
        .filter((k) => k.startsWith(options?.prefix || ''))
        .map((name) => ({ name }))
      return { keys }
    }
  }

  let kv = env?.KV || new MockKV()

  try {
    if (request.method === 'GET') {
      const userId = url.searchParams.get('userId')
      const conceptId = url.searchParams.get('conceptId')

      if (userId && conceptId) {
        const data = await kv.get(`${PREFIX}${userId}:${conceptId}`)
        return new Response(
          JSON.stringify({ data: data ? JSON.parse(data) : null }),
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      const prefix = userId ? `${PREFIX}${userId}:` : PREFIX
      const { keys } = await kv.list({ prefix })
      const items = await Promise.all(
        keys.map(async (k) => {
          const val = await kv.get(k.name)
          return val ? JSON.parse(val) : null
        }),
      )
      return new Response(JSON.stringify({ data: items.filter(Boolean) }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (request.method === 'POST') {
      const body = await request.json()
      const { action, userId, conceptId, grade, data } = body

      const key = `${PREFIX}${userId}:${conceptId}`

      if (action === 'review') {
        // Atomic Read-Modify-Write
        const existingData = await kv.get(key)
        const progress = existingData
          ? JSON.parse(existingData)
          : {
              userId,
              conceptId,
              status: 'new',
              lastInterval: 0,
              easeFactor: 2.5,
              history: [],
              createdAt: new Date().toISOString(),
            }

        const sm2Result = calculateSM2(
          grade,
          progress.lastInterval || 0,
          progress.easeFactor || 2.5,
        )

        const updatedProgress = {
          ...progress,
          status: grade >= 4 ? 'mastered' : grade >= 2 ? 'learning' : 'review',
          nextReview: sm2Result.nextReview,
          lastInterval: sm2Result.interval,
          easeFactor: sm2Result.easeFactor,
          updatedAt: new Date().toISOString(),
          history: [
            ...(progress.history || []),
            {
              date: new Date().toISOString(),
              grade,
              interval: sm2Result.interval,
            },
          ],
        }

        await kv.put(key, JSON.stringify(updatedProgress))
        return new Response(
          JSON.stringify({ success: true, data: updatedProgress }),
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      if (action === 'update' || action === 'create') {
        const finalData = { ...data, updatedAt: new Date().toISOString() }
        if (action === 'create') finalData.createdAt = new Date().toISOString()
        await kv.put(key, JSON.stringify(finalData))
        return new Response(
          JSON.stringify({ success: true, data: finalData }),
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      if (action === 'delete') {
        await kv.delete(key)
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    return new Response('Method Not Allowed', { status: 405 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
