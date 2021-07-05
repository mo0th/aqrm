import { render as _render, RenderOptions, RenderResult } from '@testing-library/react'
import type { ReactNode } from 'react'

type ProviderProps = {
  children: ReactNode
}

const Provider = ({ children }: ProviderProps) => {
  return children
}

const render = (ui: React.ReactElement, options: RenderOptions = {}): RenderResult =>
  _render(ui, { wrapper: Provider as any, ...options })

export * from '@testing-library/react'
export { render }
