/* eslint-disable @typescript-eslint/no-explicit-any */
export const logger = {
  error: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(...args)
    }
  },
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(...args)
    }
  },
  info: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.info(...args)
    }
  },
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.debug(...args)
    }
  },
}
