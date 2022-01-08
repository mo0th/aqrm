import type { FormEventHandler } from 'react'
import type { GetServerSideProps } from 'next'
import { getLayout } from '@/components/layouts/CenteredCardLayout'
import InputField from '@/components/ui/InputField'
import Button from '@/components/ui/Button'
import Link from '@/components/ui/Link'
import { useSignup } from '@/lib/auth.client'
import { getFormFields } from '@/lib/forms.client'
import { getSession } from 'next-auth/client'
import Alert from '@/components/ui/Alert'
import { config } from '@/config'

const SignupPage: Page = () => {
  const signup = useSignup()

  const handleSignup: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    const form = event.currentTarget

    const body = getFormFields<{ name: string; email: string; password: string }>(form)

    await signup.mutateAsync(body)
    form.reset()
  }

  return (
    <>
      <h1 className="mb-8 text-4xl font-bold text-center">Signup</h1>
      {signup.status === 'success' && (
        <div className="mb-6">
          <Alert variant="success">
            You can now <Link href="/login">log in</Link>!
          </Alert>
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSignup}>
        <InputField
          label="Name"
          type="text"
          required
          autoComplete="name"
          name="name"
          id="name"
          error={signup.error?.issues?.name}
        />
        <InputField
          label="Email"
          type="email"
          required
          autoComplete="email"
          name="email"
          id="email"
          error={signup.error?.issues?.email}
        />
        <InputField
          label="Password"
          type="password"
          required
          autoComplete="new-password"
          name="password"
          id="password"
          error={signup.error?.issues?.password}
        />
        <div className="flex items-center justify-between">
          <Link href="/login">Already have an account? Login</Link>
          <Button loading={signup.status === 'loading'} variant="primary" type="submit">
            Sign Up
          </Button>
        </div>
      </form>
    </>
  )
}

SignupPage.getLayout = getLayout

export default SignupPage

export const getServerSideProps: GetServerSideProps = async ctx => {
  if (!config.enableSignup) {
    return {
      notFound: true,
    }
  }

  const session = await getSession(ctx)

  if (session?.user) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
