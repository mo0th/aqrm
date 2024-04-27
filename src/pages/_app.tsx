import type { AppProps } from 'next/app'
import Head from 'next/head'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '~/lib/query.client'

import '../styles/globals.css'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  )
}

export default MyApp
