import type { Site } from '@/lib/prisma.server'
import { useEditSite } from '@/lib/sites.client'
import type { ChangeEventHandler } from 'react'
import DeleteSiteButton from './DeleteSiteButton'

interface SiteSettingsProps {
  site: Site
}

const SiteSettings: React.FC<SiteSettingsProps> = ({ site }) => {
  const editSite = useEditSite(site.name)

  const handleCheckboxChange: ChangeEventHandler<HTMLInputElement> = async event => {
    const target = event.currentTarget
    await editSite.mutateAsync({ [target.name]: target.checked })
  }

  return (
    <section className="mb-8 space-y-6">
      <h2 className="mb-4 text-2xl font-bold">Settings</h2>
      <div>
        <label className="mr-2" htmlFor="isPublic">
          Make the feedback for this site public
        </label>
        <input
          type="checkbox"
          className={'form-checkbox'}
          checked={site.isPublic}
          id="isPublic"
          name="isPublic"
          onChange={handleCheckboxChange}
        />
      </div>
      <div>
        <label className="mr-2" htmlFor="allowFeedback">
          Collect feedback for this site
        </label>
        <input
          type="checkbox"
          className={'form-checkbox'}
          checked={site.allowFeedback}
          id="allowFeedback"
          name="allowFeedback"
          onChange={handleCheckboxChange}
        />
      </div>
      <DeleteSiteButton siteName={site.name} />
    </section>
  )
}

export default SiteSettings
