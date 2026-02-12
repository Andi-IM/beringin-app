// Infrastructure: HTTP KV Client
// Implements EdgeOneKV interface by calling the Edge Function API

import type { EdgeOneKV } from './edgeone-kv.types'

export class HttpKVClient implements EdgeOneKV {
  private readonly endpoint: string

  constructor(endpoint: string = '/edge-api') {
    this.endpoint = endpoint
  }

  private async request(payload: unknown) {
    // In server-side Next.js, we might need the full URL.
    // However, if this is called from the browser or an environment with an origin,
    // relative paths work. For EdgeOne deployments, relative paths are usually fine.

    let url = this.endpoint
    if (typeof window === 'undefined' && !url.startsWith('http')) {
      // Basic heuristic: check if we have a base URL env var
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      url = `${baseUrl}${this.endpoint}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText }))
      throw new Error(`KV API Error: ${error.message || response.statusText}`)
    }

    return response.json()
  }

  async get(key: string): Promise<string | null> {
    const result = await this.request({ action: 'get', key })
    return result.data
  }

  async put(key: string, value: string): Promise<void> {
    await this.request({ action: 'put', key, value })
  }

  async delete(key: string): Promise<void> {
    await this.request({ action: 'delete', key })
  }

  async list(options?: {
    prefix?: string
    limit?: number
  }): Promise<{ keys: { name: string }[] }> {
    return this.request({ action: 'list', options })
  }
}
