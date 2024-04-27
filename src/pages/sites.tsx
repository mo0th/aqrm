import SitesSection from '~/components/dashboard/SitesSection'
import MainLayout from '~/components/layouts/MainLayout/MainLayout'

import Title from '~/components/shared/Title'

const SitesPage = () => {
  return (
    <MainLayout>
      <Title text="Your Sites" />
      <SitesSection />
    </MainLayout>
  )
}

export default SitesPage
