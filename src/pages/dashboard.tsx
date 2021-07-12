import Title from '@/components/shared/Title'
import MainLayout from '@/components/layouts/MainLayout'
import SitesSection from '@/components/dashboard/SitesSection'

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <Title text="Dashboard" />
      <SitesSection />
    </MainLayout>
  )
}

export const layout = 'hello'

export default HomePage
