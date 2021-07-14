import { buildWidgetScript } from '@/lib/widget.server'
import type { NextApiHandler } from 'next-auth/internals/utils'

const handler: NextApiHandler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const { s } = req.query

  const script = await buildWidgetScript(typeof s === 'string' ? s : '')

  res.end(script)
}

export default handler
