import { QueryClientProvider } from '~/lib/tanstack-query'
import '~/styles/globals.css'

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <title>aqrm</title>

        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link
          rel="preload"
          href="/fonts/Inter-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Inter-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          async
          defer
          data-domain="aqrm.soorria.com"
          data-api="https://soorria.com/proxy/api/event"
          src="https://soorria.com/js/potato.js"
        />
      </head>
      <body className="h-full min-h-screen text-black bg-gray-100">
        <QueryClientProvider>{props.children}</QueryClientProvider>
      </body>
    </html>
  )
}
