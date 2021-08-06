/// <reference types="next" />
/// <reference types="next/types/global" />

/**
 * Put type declarations in here
 */

declare namespace NodeJS {
  // Extend `process.env` for better type completion
  interface ProcessEnv {
    NEXTAUTH_SECRET: string
    NEXTAUTH_JWT_SECRET: string
    NEXTAUTH_URL: string
    NEXT_PUBLIC_BASE_URL: string
  }
}

import type { FunctionComponent, ReactNode } from 'react'

declare global {
  type GetLayout = (page: ReactNode) => ReactNode

  interface Page<T = any> extends FunctionComponent<T> {
    getLayout?: GetLayout
  }
}
