import Button from '@/components/ui/Button'
import { useMe } from '@/lib/auth.client'
import { signout } from 'next-auth/client'

const HomePage: React.FC = () => {
  const { data } = useMe()
  return (
    <>
      {data?.user && (
        <Button variant="primary" onClick={() => signout()}>
          Logout
        </Button>
      )}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default HomePage
