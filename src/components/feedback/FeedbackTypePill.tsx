import { FeedbackType } from '@/types'
import clsx from 'clsx'

interface FeedbackTypePillProps {
  type: FeedbackType
}

const baseClass = 'rounded px-2 font-bold text-sm w-16 text-center'

const typeToClass: Record<FeedbackType, string> = {
  [FeedbackType.ISSUE]: 'bg-red-200 text-red-700',
  [FeedbackType.IDEA]: 'bg-cyan-200 text-cyan-700',
  [FeedbackType.OTHER]: 'bg-yellow-200 text-yellow-700',
}

const FeedbackTypePill: React.FC<FeedbackTypePillProps> = ({ type }) => {
  return <span className={clsx(baseClass, typeToClass[type])}>{type}</span>
}

export default FeedbackTypePill
