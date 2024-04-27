import CenteredCardLayout from '~/components/layouts/CenteredCardLayout'
import Link from '~/components/ui/Link'

const LoggedOutPage = () => {
  return (
    <CenteredCardLayout>
      <h1 className="mb-8 text-4xl font-bold text-center">You&apos;re Logged Out!</h1>
      <div className="flex justify-around space-x-4">
        <Link href="/login">Login</Link>
        <Link href="/login">Sign Up</Link>
      </div>
    </CenteredCardLayout>
  )
}

export default LoggedOutPage
