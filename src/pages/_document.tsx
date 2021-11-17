import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends NextDocument {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
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
            data-domain="aqrm.mooth.tech"
            data-api="https://mooth.tech/proxy/api/event"
            src="https://mooth.tech/js/potato.js"
          />
        </Head>
        <body className="h-full min-h-screen text-black bg-gray-100">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
