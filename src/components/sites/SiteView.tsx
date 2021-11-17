import { useMe } from '@/lib/auth.client'
import type { Site } from '@prisma/client'
import FeedbackView from '../feedback/FeedbackView'
import SiteSettings from './SiteSettings'

interface SiteViewProps {
  site: Site
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
