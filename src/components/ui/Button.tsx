import type { ButtonHTMLAttributes } from 'react'

import clsx from 'clsx'

export const sizes = {
  md: 'px-4 py-2 rounded',
  sm: 'px-2 py-1 text-sm rounded',
}

const base = {
  DEFAULT: 'focus:outline-none relative inline-flex justify-center',
  ACTIVE: '',
  DISABLED: 'cursor-not-allowed',
}

export const variants = {
  primary: {
    DEFAULT: 'bg-primary-600 text-white',
    ACTIVE: 'hover:bg-primary-500 transition focus:ring focus:ring-primary-300',
    DISABLED: 'opacity-40',
  },
  muted: {
    DEFAULT: 'bg-gray-200 text-gray-700',
    ACTIVE: 'hover:bg-gray-300 transition focus:ring focus:ring-primary-300',
    DISABLED: 'opacity-40',
  },
  delete: {
    DEFAULT: 'bg-red-600 text-white',
    ACTIVE: 'hover:bg-red-500 transition focus:ring focus:ring-red-300',
    DISABLED: 'opacity-40',
  },
  transparentDelete: {
    DEFAULT: 'bg-transparent text-red-700',
    ACTIVE: 'hover:bg-red-100 transition focus:ring focus:ring-red-300',
    DISABLED: 'opacity-40',
  },
}

type ButtonProps = {
  variant: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled,
  loading = false,
  children,
  className,
  ...rest
}) => {
  const shouldUsedisabledStyles = disabled || loading
  const variantClasses = variants[variant]

  return (
    <button
      type="button"
      disabled={shouldUsedisabledStyles}
      className={clsx(
        base.DEFAULT,
        variantClasses.DEFAULT,
        shouldUsedisabledStyles ? base.DISABLED : base.ACTIVE,
        shouldUsedisabledStyles ? variantClasses.DISABLED : variantClasses.ACTIVE,
        sizes[size],
        className
      )}
      {...rest}
    >
      {!loading && children}
      {loading && (
        <>
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <span
              className="h-[1em] w-[1em] rounded-full border-2 border-current animate-spin-fast"
              style={{ borderBottomColor: 'transparent', borderRightColor: 'transparent' }}
            />
            <span className="sr-only">Loading</span>
          </span>
          <span className="opacity-0">{children}</span>
        </>
      )}
    </button>
  )
}

export default Button
