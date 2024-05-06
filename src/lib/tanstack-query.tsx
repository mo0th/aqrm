'use client'

import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

export const QueryClientProvider = (props: { children: React.ReactNode }) => {
  return (
    <TanstackQueryClientProvider client={queryClient}>{props.children}</TanstackQueryClientProvider>
  )
}
