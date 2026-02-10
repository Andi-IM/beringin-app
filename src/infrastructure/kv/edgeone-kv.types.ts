// Infrastructure: EdgeOne KV type definitions
// Defines the KV interface to allow mocking in tests

export interface EdgeOneKV {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
  list(options?: { prefix?: string; limit?: number }): Promise<{
    keys: { name: string }[]
  }>
}
