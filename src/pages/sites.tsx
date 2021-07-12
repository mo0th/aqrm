import SitesSection from '@/components/dashboard/SitesSection'
import MainLayout from '@/components/layouts/MainLayout'
import Title from '@/components/shared/Title'

const SitesPage: React.FC = () => {
  return (
    <MainLayout>
      <Title text="Your Sites" />
      <SitesSection />
    </MainLayout>
  )
}

export default SitesPage
