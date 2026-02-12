// EdgeOne Edge Function: KV API Gateway
// Acts as a proxy for KV storage access.
// Path: /api/edgeone

export async function onRequestGet(context) {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST' },
  })
}

export async function onRequestPost(context) {
  // MockKV Implementation for Local Dev
  class MockKV {
    constructor() {
      if (!globalThis.mockKVStore) {
        globalThis.mockKVStore = new Map()
      }
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
      // Simple list implementation
      const keys = Array.from(this.store.keys()).map((name) => ({ name }))
      return { keys }
    }
  }

  const { request, env } = context

  try {
    const body = await request.json()
    const { action, key, value, options } = body

    // KV binding name from edgeone.json is "KV"
    let kv = env && env.KV

    if (!kv) {
      // Use MockKV for local development if real KV is missing
      kv = new MockKV()
    }

    switch (action) {
      case 'get': {
        const data = await kv.get(key)
        return new Response(JSON.stringify({ data: data || null }), {
          headers: { 'Content-Type': 'application/json' },
        })
      }

      case 'put': {
        await kv.put(key, value)
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' },
        })
      }

      case 'delete': {
        await kv.delete(key)
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' },
        })
      }

      case 'list': {
        const result = await kv.list(options)
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' },
        })
      }

      case 'debug': {
        return new Response(
          JSON.stringify({
            contextKeys: Object.keys(context),
            envKeys: env ? Object.keys(env) : null,
            kvType:
              kv instanceof MockKV
                ? 'MockKV'
                : env && env.KV
                  ? typeof env.KV
                  : 'undefined',
            usingMock: kv instanceof MockKV,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: `Invalid action: ${action}` }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          },
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
