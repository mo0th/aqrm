import InputField from '~/components/ui/InputField'
import Button from '~/components/ui/Button'
import Link from '~/components/ui/Link'
import { useLoginPW } from '~/lib/auth.client'
import { getFormFields } from '~/lib/forms.client'
import type { FormEventHandler } from 'react'
import Alert from '~/components/ui/Alert'
import { config } from '~/config'
import CenteredCardLayout from '~/components/layouts/CenteredCardLayout'

const LoginPage = () => {
  const login = useLoginPW()

  const handleLogin: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    const form = event.currentTarget

    const body = getFormFields<{ email: string; password: string }>(form)

    await login.mutateAsync(body)
    form.reset()
  }

  return (
    <CenteredCardLayout>
      <h1 className="mb-8 text-4xl font-bold text-center">Login</h1>
      {login.status === 'error' && (
        <div className="mb-6">
          <Alert variant="error">Invalid Login Credentials</Alert>
        </div>
      )}
      <form className="space-y-6" method="post" onSubmit={handleLogin}>
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
          <Button variant="primary" type="submit" loading={login.isPending}>
            Login
          </Button>
        </div>
      </form>
    </CenteredCardLayout>
  )
}

export default LoginPage

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const session = await getSession(ctx)

//   if (session?.user) {
//     return {
//       redirect: {
//         destination: '/dashboard',
//         permanent: false,
//       },
//     }
//   }

//   const csrfToken = await getCsrfToken(ctx)
//   return {
//     props: {
//       csrfToken,
//     },
//   }
// }
