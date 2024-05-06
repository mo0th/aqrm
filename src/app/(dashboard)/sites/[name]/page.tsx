'use client'

import Title from '~/components/shared/Title'
import SiteView from '~/components/sites/SiteView'
import Spinner from '~/components/ui/Spinner'
import { useSite } from '~/lib/sites.client'

const SitePage = (props: { params: { name: string } }) => {
  const siteName = props.params.name
  const { data, status } = useSite(siteName)

  return (
    <>
      <Title text={siteName ?? 'Not Found'} />

      {status === 'pending' && (
        <div className="text-center">
          <Spinner />
          <span className="ml-2">Loading {siteName}</span>
        </div>
      )}

      {status === 'success' && data && <SiteView site={data.site} />}
    </>
  )
}

export default SitePage
