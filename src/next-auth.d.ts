import * as c from 'next-auth/client'

declare module 'next-auth/client' {
  interface Session {
    user: c.Session['user'] & { id: number }
  }
}
