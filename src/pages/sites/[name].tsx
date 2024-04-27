import Title from '~/components/shared/Title'
import SiteView from '~/components/sites/SiteView'
import Spinner from '~/components/ui/Spinner'
import { useSite } from '~/lib/sites.client'
import { useRouter } from 'next/router'
import MainLayout from '~/components/layouts/MainLayout/MainLayout'

const SitePage = () => {
  const router = useRouter()
  const siteName = router.query.name as string | undefined
  const { data, status } = useSite(siteName)

  return (
    <MainLayout>
      <Title text={siteName ?? 'Not Found'} />
      {status === 'pending' && (
        <div className="text-center">
          <Spinner />
          <span className="ml-2">Loading {siteName}</span>
        </div>
      )}

      {status === 'success' && data && <SiteView site={data} />}
    </MainLayout>
  )
}

export default SitePage
