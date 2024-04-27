import { useMe } from '~/lib/auth.client'
import FeedbackView from '../feedback/FeedbackView'
import SiteSettings from './SiteSettings'
import { Doc } from '~/lib/db/types'

interface SiteViewProps {
  site: Doc<'site'>
}

const SiteView: React.FC<SiteViewProps> = ({ site }) => {
  const me = useMe()

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold">{site.name}</h1>
      <FeedbackView siteName={site.name} />
      <div aria-hidden className="py-8" />
      {me.data ? <SiteSettings site={site} /> : null}
    </div>
  )
}

export default SiteView
