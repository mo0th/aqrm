import { buildWidgetScript } from '~/lib/widget.server'
import type { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { s } = req.query

  const script = await buildWidgetScript(typeof s === 'string' ? s : '')
  res.setHeader('Cache-Control', 'public, s-max-age=2678400')
  res.setHeader('Content-Type', 'application/javascript')

  res.end(script)
}

export default handler
