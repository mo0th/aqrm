import { buildWidgetScript } from '~/lib/widget.server'

export async function GET() {
  const script = await buildWidgetScript()

  return new Response(script, {
    headers: {
      'Cache-Control': 'public, s-max-age=2678400',
      'Content-Type': 'application/javascript',
    },
  })
}
