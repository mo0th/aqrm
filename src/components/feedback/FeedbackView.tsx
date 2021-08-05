import { useSiteFeedback } from '@/lib/feedback.client'
import type { FeedbackType } from '@/types'
import Spinner from '../ui/Spinner'
import FeedbackTypePill from './FeedbackTypePill'

interface FeedbackViewProps {
  siteName: string
}

const FeedbackView: React.FC<FeedbackViewProps> = ({ siteName }) => {
  const { data, status } = useSiteFeedback(siteName)
  return (
    <section className="mb-8 space-y-6">
      <h2 className="mb-4 text-2xl font-bold">Feedback</h2>
      {status === 'loading' && (
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
                  {new Date(feedbackItem.createdAt).toLocaleTimeString(undefined, { hour12: true })}
                  {' • '}
                  {new Date(feedbackItem.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p>{feedbackItem.text}</p>
            </div>
          ))}
          {data?.length === 0 && (
            <div className="py-24 text-center col-span-full">
              This site hasn&apos;t received any feedback yet.
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default FeedbackView
