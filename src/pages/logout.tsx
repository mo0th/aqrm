import { getLayout } from '@/components/layouts/CenteredCardLayout'
import Spinner from '@/components/ui/Spinner'
import { useLogout } from '@/lib/auth.client'
import { useEffect } from 'react'

const LogoutPage: Page = () => {
  const { mutate: logout } = useLogout()

  useEffect(() => {
    logout()
  }, [logout])

  return (
    <>
      <h1 className="mb-8 text-4xl font-bold text-center">Logging You Out</h1>
      <div className="text-3xl text-center">
        <Spinner />
      </div>
    </>
  )
}

LogoutPage.getLayout = getLayout

export default LogoutPage
