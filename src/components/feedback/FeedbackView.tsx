import { useMe } from '~/lib/auth.client'
import { useDeleteFeedback, useSiteFeedback } from '~/lib/feedback.client'
import type { FeedbackType } from '~/types'
import SiteScript from '../sites/SiteScript'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import FeedbackTypePill from './FeedbackTypePill'

interface FeedbackViewProps {
  siteName: string
}

const FeedbackView: React.FC<FeedbackViewProps> = ({ siteName }) => {
  const { data, status } = useSiteFeedback(siteName)
  const me = useMe()

  const deleteFeedback = useDeleteFeedback(siteName)

  const handleDeleteFeedback = (id: string) => async () => {
    await deleteFeedback.mutateAsync({ id })
  }

  return (
    <section className="mb-8 space-y-6">
      <h2 className="mb-4 text-2xl font-bold">Feedback</h2>
      {status === 'pending' && (
        <div className="text-center">
          <Spinner />
          <span className="ml-2">Loading feedback</span>
        </div>
      )}

      {status === 'success' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {data?.map(feedbackItem => (
            <div className="p-4 bg-gray-200 rounded-xl" key={feedbackItem.id}>
              <div className="flex items-center justify-between mb-4 space-x-4">
                <FeedbackTypePill type={feedbackItem.type as FeedbackType} />
                <span className="text-sm">
                  {new Date(feedbackItem.createdAt).toLocaleTimeString(undefined, {
                    hour12: false,
                  })}
                  {' • '}
                  {new Date(feedbackItem.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p>{feedbackItem.text}</p>
              {feedbackItem.imageUrl ? (
                <img
                  src={feedbackItem.imageUrl}
                  alt="TODO"
                  className="w-full aspect-video object-cover mt-4"
                />
              ) : null}
              <hr className="my-4 border-gray-300" />
              <div className="flex items-center justify-between space-x-1">
                {feedbackItem.userId && (
                  <p className="text-xs italic truncate">uid: {feedbackItem.userId}</p>
                )}
                <div className="flex-1" />
                <Button
                  variant="transparentDelete"
                  size="sm"
                  onClick={handleDeleteFeedback(feedbackItem.id)}
                  loading={deleteFeedback.variables?.id === feedbackItem.id}
                  disabled={!me.data}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {data?.length === 0 && (
            <div className="flex flex-col items-center py-12 space-y-4 col-span-full">
              <p className="max-w-md">
                This site hasn&apos;t received any feedback yet. Add the following code to your site
                to start collecting feedback.
              </p>
              <SiteScript siteName={siteName} />
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default FeedbackView
