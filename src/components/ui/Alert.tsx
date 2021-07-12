import clsx from 'clsx'

const base = 'p-4 border rounded'

const variants = {
  success: 'bg-primary-100 border-primary-700 text-primary-700',
}

interface AlertProps {
  variant: keyof typeof variants
}

const Alert: React.FC<AlertProps> = ({ variant, children }) => {
  return <div className={clsx(base, variants[variant])}>{children}</div>
}

export default Alert
