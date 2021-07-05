import type { NextAuthOptions } from 'next-auth'
import type { NextApiHandler } from 'next'

import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import * as auth from '@/lib/auth.server'

const config: NextAuthOptions = {
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      name: 'Username / Password Login',
      credentials: [
        { label: 'Email', type: 'email' },
        { label: 'Password', type: 'password' },
      ],
      authorize({ email, password }: { email: string; password: string }) {
        return auth.loginUser(email, password)
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'production',
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
}

const handler: NextApiHandler = (req, res) => NextAuth(req, res, config)

export default handler
