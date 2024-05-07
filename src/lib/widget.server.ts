import { promises as fs } from 'fs'
import path from 'path'
import { env } from '~/env'

// const WIDGET_PATH = path.join(process.cwd(), 'widget', 'dist', 'script.js')
const WIDGET_PATH = path.join(process.cwd(), 'public', 'script.js')

export const buildWidgetScript = async (): Promise<string> => {
  // const script = await fs.readFile(WIDGET_PATH, 'utf-8')
  const script = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/script.js`).then(res => res.text())

  return [`window._AQRM_BASE_URL="${env.NEXT_PUBLIC_BASE_URL}"`, script].join(';')
}
