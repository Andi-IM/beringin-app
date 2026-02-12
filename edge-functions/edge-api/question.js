// EdgeOne Edge Function: Question API
// Path: /edge-api/question

const PREFIX = 'question:'

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
      const conceptId = url.searchParams.get('conceptId')
      const id = url.searchParams.get('id')

      if (id) {
        // Find by ID requires listing because of key structure question:conceptId:id
        const { keys } = await kv.list({ prefix: PREFIX })
        const targetKey = keys.find((k) => k.name.endsWith(`:${id}`))
        if (!targetKey)
          return new Response(JSON.stringify({ data: null }), {
            headers: { 'Content-Type': 'application/json' },
          })
        const data = await kv.get(targetKey.name)
        return new Response(
          JSON.stringify({ data: data ? JSON.parse(data) : null }),
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      const prefix = conceptId ? `${PREFIX}${conceptId}:` : PREFIX
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
      const { action, id, data } = body

      if (action === 'create' || action === 'update') {
        const targetId = id || data.id
        const conceptId = data.conceptId
        const key = `${PREFIX}${conceptId}:${targetId}`

        const finalData = { ...data, updatedAt: new Date().toISOString() }
        if (action === 'create' && !finalData.createdAt) {
          finalData.createdAt = new Date().toISOString()
        }

        // If conceptId changed during update, delete old key
        if (action === 'update') {
          const { keys } = await kv.list({ prefix: PREFIX })
          const oldKey = keys.find(
            (k) => k.name.endsWith(`:${targetId}`) && k.name !== key,
          )
          if (oldKey) await kv.delete(oldKey.name)
        }

        await kv.put(key, JSON.stringify(finalData))
        return new Response(
          JSON.stringify({ success: true, data: finalData }),
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      if (action === 'delete') {
        const { keys } = await kv.list({ prefix: PREFIX })
        const targetKey = keys.find((k) => k.name.endsWith(`:${id}`))
        if (targetKey) await kv.delete(targetKey.name)
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
