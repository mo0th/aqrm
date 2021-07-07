import type { GetServerSideProps } from 'next'
import { getCsrfToken, getSession } from 'next-auth/client'

import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import InputField from '@/components/ui/InputField'
import Button from '@/components/ui/Button'
import Link from '@/components/ui/Link'

interface LoginPageProps {
  csrfToken: string
}

const LoginPage: React.FC<LoginPageProps> = ({ csrfToken }) => {
  return (
    <CenteredCardLayout>
      <h1 className="mb-8 text-4xl font-bold text-center">Login</h1>
      <form className="space-y-6" method="post" action="/api/auth/callback/credentials">
        <input type="hidden" name="csrfToken" defaultValue={csrfToken} hidden />
        <InputField
          label="Email"
          type="email"
          required
          autoComplete="email"
          name="email"
          id="email"
        />
        <InputField
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          name="password"
          id="password"
        />
        <div className="flex items-center justify-between">
          <Link href="/signup">Don&apos;t have an account? Sign Up!</Link>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </div>
      </form>
    </CenteredCardLayout>
  )
}

export default LoginPage

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx)

  if (session?.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const csrfToken = await getCsrfToken(ctx)
  return {
    props: {
      csrfToken,
    },
  }
}
