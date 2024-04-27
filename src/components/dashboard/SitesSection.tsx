import Spinner from '~/components/ui/Spinner'
import Link from '~/components/ui/Link'
import CreateSiteTile from '~/components/sites/CreateSiteTile'
import { useSites } from '~/lib/sites.client'

const SitesSection: React.FC = () => {
  const { data, status } = useSites()
  return (
    <>
      <h1 className="mb-8 text-4xl font-bold">Your Sites</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {status === 'pending' && (
          <div className="text-center text-black align-middle col-span-full">
            <Spinner />
            <span className="ml-2">Loading your sites</span>
          </div>
        )}

        {status === 'success' && <CreateSiteTile />}
        {status === 'success' &&
          data?.map(site => (
            <Link
              href={`/sites/${site.name}`}
              key={site.id}
              className="flex items-center p-4 space-x-4 transition bg-gray-200 rounded hover:bg-gray-300 hover:shadow-lg"
            >
              <span className="block w-5 h-5">
                <img
                  src={`https://icons.duckduckgo.com/ip3/${encodeURIComponent(site.name)}.ico`}
                  alt=""
                  aria-hidden
                  width={20}
                  height={20}
                  className="block"
                />
              </span>
              <span className="text-lg">{site.name}</span>
            </Link>
          ))}
      </div>
    </>
  )
}

export default SitesSection
