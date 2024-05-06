import { buildWidgetScript } from '~/lib/widget.server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const site = url.searchParams.get('s')

  const script = await buildWidgetScript(typeof site === 'string' ? site : '')

  return new Response(script, {
    headers: {
      'Cache-Control': 'public, s-max-age=2678400',
      'Content-Type': 'application/javascript',
    },
  })
}
