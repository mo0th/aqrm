import Head from 'next/head'

interface TitleProps {
  text: string
  raw?: boolean
}

const Title: React.FC<TitleProps> = ({ text, raw = false }) => {
  return (
    <Head>
      <title>
        {text}
        {!raw && ' • AQRM'}
      </title>
    </Head>
  )
}

export default Title
