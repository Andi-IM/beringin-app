// EdgeOne Edge Function: Concept API
// Path: /edge-api/concept

const PREFIX = 'concept:'

export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const path = url.pathname

  // MockKV for Local Dev
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
      const url = new URL(request.url)
      const id = url.searchParams.get('id')
      const userId = url.searchParams.get('userId')

      if (!userId) {
        return new Response(JSON.stringify({ error: 'UserId is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const USER_PREFIX = `user:${userId}:${PREFIX}`

      if (id) {
        const data = await kv.get(`${USER_PREFIX}${id}`)
        return new Response(
          JSON.stringify({ data: data ? JSON.parse(data) : null }),
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      // List all for user
      const { keys } = await kv.list({ prefix: USER_PREFIX })
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
      console.log('[EdgeAPI] POST body:', JSON.stringify(body, null, 2))
      const { action, id, data } = body
      const userId = data?.userId || body.userId
      console.log('[EdgeAPI] Extracted userId:', userId)

      if (!userId) {
        return new Response(JSON.stringify({ error: 'UserId is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const USER_PREFIX = `user:${userId}:${PREFIX}`

      if (action === 'create' || action === 'update') {
        const targetId = id || data.id
        const finalData = { ...data, updatedAt: new Date().toISOString() }
        if (action === 'create' && !finalData.createdAt) {
          finalData.createdAt = new Date().toISOString()
        }
        await kv.put(`${USER_PREFIX}${targetId}`, JSON.stringify(finalData))
        return new Response(
          JSON.stringify({ success: true, data: finalData }),
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      if (action === 'delete') {
        const targetId = id || data.id
        await kv.delete(`${USER_PREFIX}${targetId}`)
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    return new Response('Method Not Allowed', { status: 405 })
  } catch (error) {
    console.error('[EdgeAPI] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
