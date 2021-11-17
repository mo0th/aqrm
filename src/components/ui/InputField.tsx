import clsx from 'clsx'
import type { InputHTMLAttributes, ReactNode } from 'react'

type InputFieldProps = {
  id: string
  name: string
  label?: ReactNode
  error?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

const InputField: React.FC<InputFieldProps> = ({ label, id, name, error, required, ...rest }) => {
  const isError = !!error
  const errorId = isError ? `${id}--error-text` : undefined

  return (
    <div>
      {label && (
        <label className="block mb-2" htmlFor={id}>
          {label}
          {required && <span className="text-error-600">*</span>}
        </label>
      )}
      <input
        aria-describedby={errorId}
        aria-invalid={!!error}
        className={clsx('block w-full form-input', isError && '!border-error-600')}
        required={required}
        id={id}
        name={name}
        {...rest}
      />
      {error && (
        <p className="block mt-2 text-sm text-error-600" id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}

export default InputField
