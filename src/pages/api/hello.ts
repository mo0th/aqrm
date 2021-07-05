import type { NextApiHandler } from 'next'

const handler: NextApiHandler = (req, res) => {
  res.status(200).json({ name: `Hello, ${req.query.name ?? 'World'}!` })
}

export default handler
