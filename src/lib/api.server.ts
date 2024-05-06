import type { NextApiHandler } from 'next'
import { ZodError } from 'zod'
import { ApiError } from './error.server'
import { env } from '~/env'

export const createApiHandler = (handler: NextApiHandler): NextApiHandler => {
  return async (req, res) => {
    if (env.NODE_ENV !== 'production') {
      console.log(`${req.method} ${req.url}`)
    }

    try {
      await handler(req, res)
    } catch (err) {
      if (res.headersSent) {
        console.error(err)
      } else if (err instanceof ApiError) {
        res.status(err.statusCode).json({
          message: err.message,
          ...(env.NODE_ENV !== 'production' ? { stack: err.stack } : undefined),
        })
      } else if (err instanceof ZodError) {
        const issues: Record<string, string> = {}

        for (const issue of err.issues) {
          issues[issue.path.join('.')] = issue.message
        }

        res.status(406).json({ issues })
      } else {
        console.error(err)
        res.status(500).json({
          message: 'An Unknown Error happened on the server. Let me know, so I can fix it.',
        })
      }
    } finally {
      if (!res.headersSent) {
        res.status(404).json({ message: 'Not Found' })
      }
      res.end()
    }
  }
}
