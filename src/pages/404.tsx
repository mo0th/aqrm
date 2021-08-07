import Link from '@/components/ui/Link'
import { getLayout } from '@/components/layouts/CenteredCardLayout'
import { useMe } from '@/lib/auth.client'

const links = [
  {
    text: 'Sites',
    href: '/sites',
  },
  {
    text: 'Feedback',
    href: '/feedback/all',
  },
  {
    text: 'Profile',
    href: '/profile',
  },
]

const NotFound: Page = () => {
  const { data: me } = useMe()
  return (
    <>
      <h1 className="mb-8 text-4xl font-bold text-center">Page Not Found</h1>
      <div className="flex justify-around space-x-4">
        {me?.user ? (
          links.map(({ href, text }) => (
            <Link href={href} key={href}>
              {text}
            </Link>
          ))
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/login">Sign Up</Link>
          </>
        )}
      </div>
    </>
  )
}

NotFound.getLayout = getLayout

export default NotFound
