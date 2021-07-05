import Head from 'next/head'

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen px-4 py-8 bg-gray-100">
      <Head>
        <title>Soorria&apos;s Next.js Template</title>
      </Head>
      <h1 className="mx-4 mb-16 text-3xl font-bold text-center sm:text-4xl md:text-5xl">
        Soorria&apos;s Next.js + TailwindCSS + TypeScript Template
      </h1>
    </div>
  )
}

export default HomePage
