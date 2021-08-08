import clsx from 'clsx'

const base = 'p-4 border rounded'

const variants = {
  success: 'bg-primary-100 border-primary-700 text-primary-700',
  error: 'bg-red-100 border-red-700 text-red-700',
}

interface AlertProps {
  variant: keyof typeof variants
}

const Alert: React.FC<AlertProps> = ({ variant, children }) => {
  return (
    <div role="alert" className={clsx(base, variants[variant])}>
      {children}
    </div>
  )
}

export default Alert
