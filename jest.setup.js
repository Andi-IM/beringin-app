import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

if (typeof global.Request === 'undefined') {
  global.Request = class {
    constructor(input, init = {}) {
      this.url = typeof input === 'string' ? input : input.url
      this.method = init.method || 'GET'
      this._body = init.body
      this.headers = init.headers || {}
    }

    async json() {
      if (!this._body) {
        return {}
      }
      if (typeof this._body === 'string') {
        return JSON.parse(this._body)
      }
      return this._body
    }
  }
}

if (typeof global.Response === 'undefined') {
  global.Response = class {
    constructor(body = null, init = {}) {
      this._body = body
      this.status = init.status || 200
      this.headers = init.headers || {}
    }

    async json() {
      if (!this._body) {
        return {}
      }
      if (typeof this._body === 'string') {
        return JSON.parse(this._body)
      }
      return this._body
    }

    async text() {
      if (this._body == null) {
        return ''
      }
      if (typeof this._body === 'string') {
        return this._body
      }
      return JSON.stringify(this._body)
    }
  }
}
