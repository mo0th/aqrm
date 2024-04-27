import Link from '~/components/ui/Link'
import { useMe } from '~/lib/auth.client'
import NextLink from 'next/link'

const navLinks = [
  {
    text: 'Sites',
    href: '/sites',
  },
  {
    text: 'Widget Editor',
    href: '/widget',
  },
  {
    text: 'Logout',
    href: '/logout',
  },
]

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: me } = useMe()

  return (
    <>
      <header className="container flex items-center justify-between py-4 mb-8 md:py-6">
        <NextLink href="/dashboard" className="text-3xl font-bold text-primary-700">
          AQRM
        </NextLink>

        <nav className="flex items-center space-x-0 sm:space-x-4">
          {me ? (
            navLinks.map(({ text, href }) => (
              <Link href={href} key={href} className="px-2 font-bold">
                {text}
              </Link>
            ))
          ) : (
            <>
              <Link href="/widget" className="px-2 font-bold">
                Widget Editor
              </Link>
              <Link href="/login" className="px-2 font-bold">
                Login
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="container flex-1 pb-24">{children}</main>
    </>
  )
}

export default MainLayout
