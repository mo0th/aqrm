import { buildWidgetScript } from '@/lib/widget.server'
import type { NextApiHandler } from 'next-auth/internals/utils'

const handler: NextApiHandler = async (req, res) => {
  const { s } = req.query

  const script = await buildWidgetScript(typeof s === 'string' ? s : '')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-max-age=31536000')

  res.end(script)
}

export default handler
