import Spinner from '~/components/ui/Spinner'
import { useLogout } from '~/lib/auth.client'
import { useEffect } from 'react'
import CenteredCardLayout from '~/components/layouts/CenteredCardLayout'

const LogoutPage = () => {
  const { mutate: logout } = useLogout()

  useEffect(() => {
    logout()
  }, [logout])

  return (
    <CenteredCardLayout>
      <h1 className="mb-8 text-4xl font-bold text-center">Logging You Out</h1>
      <div className="text-3xl text-center">
        <Spinner />
      </div>
    </CenteredCardLayout>
  )
}

export default LogoutPage
