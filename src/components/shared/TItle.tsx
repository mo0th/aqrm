import Head from 'next/head'

interface TItleProps {
  text: string
}

const TItle: React.FC<TItleProps> = ({ text }) => {
  return (
    <Head>
      <title>{text}</title>
    </Head>
  )
}

export default TItle
