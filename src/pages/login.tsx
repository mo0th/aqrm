import type { GetServerSideProps } from 'next'
import { getCsrfToken, getSession } from 'next-auth/client'

import { getLayout } from '@/components/layouts/CenteredCardLayout'
import InputField from '@/components/ui/InputField'
import Button from '@/components/ui/Button'
import Link from '@/components/ui/Link'
import { useLogin } from '@/lib/auth.client'
import { getFormFields } from '@/lib/forms.client'
import type { FormEventHandler } from 'react'
import Alert from '@/components/ui/Alert'
import { config } from '@/config'

interface LoginPageProps {
  csrfToken: string
}

const LoginPage: Page<LoginPageProps> = ({ csrfToken }) => {
  const login = useLogin()

  const handleLogin: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    const form = event.currentTarget

    const body = getFormFields<{ email: string; password: string }>(form)

    await login.mutateAsync(body)
    form.reset()
  }

  return (
    <>
      <h1 className="mb-8 text-4xl font-bold text-center">Login</h1>
      {login.status === 'error' && (
        <div className="mb-6">
          <Alert variant="error">Invalid Login Credentials</Alert>
        </div>
      )}
      <form
        className="space-y-6"
        method="post"
        onSubmit={handleLogin}
        action="/api/auth/callback/credentials"
      >
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
        <div className="flex items-center">
          {config.enableSignup ? (
            <Link href="/signup">Don&apos;t have an account? Sign Up!</Link>
          ) : null}
          <div className="flex-1" />
          <Button variant="primary" type="submit" loading={login.isLoading}>
            Login
          </Button>
        </div>
      </form>
    </>
  )
}

LoginPage.getLayout = getLayout

export default LoginPage

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx)

  if (session?.user) {
    return {
      redirect: {
        destination: '/dashboard',
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
