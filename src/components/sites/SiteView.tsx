import type { Site } from '@prisma/client'
import DeleteSiteButton from './DeleteSiteButton'

interface SiteViewProps {
  site: Site
}

const SiteView: React.FC<SiteViewProps> = ({ site }) => {
  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold">{site.name}</h1>

      <h2 className="mb-4 text-2xl font-bold">Feedback</h2>

      <h2 className="mb-4 text-2xl font-bold">Danger Zone</h2>
      <DeleteSiteButton siteName={site.name} />
    </div>
  )
}

export default SiteView
