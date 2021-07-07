import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider as SessionProvider } from 'next-auth/client'
import { QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'

import { queryClient } from '@/lib/query.client'

import '../styles/globals.css'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
          </SessionProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
