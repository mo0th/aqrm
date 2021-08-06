import SitesSection from '@/components/dashboard/SitesSection'
import { getLayout } from '@/components/layouts/MainLayout'
import Title from '@/components/shared/Title'

const SitesPage: Page = () => {
  return (
    <>
      <Title text="Your Sites" />
      <SitesSection />
    </>
  )
}

SitesPage.getLayout = getLayout

export default SitesPage
