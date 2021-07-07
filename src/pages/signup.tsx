import type { FormEventHandler } from 'react'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import InputField from '@/components/ui/InputField'
import Button from '@/components/ui/Button'
import Link from '@/components/ui/Link'
import { useSignup } from '@/lib/auth.client'
import { getFormFields } from '@/lib/forms.client'
import { getSession } from 'next-auth/client'
import type { GetServerSideProps } from 'next'

interface SignupPageProps {}

const SignupPage: React.FC<SignupPageProps> = () => {
  const signup = useSignup()

  const handleSignup: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    const body = getFormFields<{ name: string; email: string; password: string }>(
      event.currentTarget
    )

    await signup.mutateAsync(body)
  }

  return (
    <CenteredCardLayout>
      <h1 className="mb-8 text-4xl font-bold text-center">Signup</h1>
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
    </CenteredCardLayout>
  )
}

export default SignupPage

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

  return {
    props: {},
  }
}
