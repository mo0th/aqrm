import { promises as fs } from 'fs'
import path from 'path'
import { env } from '~/env'

// const WIDGET_PATH = path.join(process.cwd(), 'widget', 'dist', 'script.js')
const WIDGET_PATH = path.join(process.cwd(), 'public', 'script.js')

export const buildWidgetScript = async (siteName: string): Promise<string> => {
  const scriptFile = (await fs.readFile(WIDGET_PATH)).toString()

  return [
    `window._AQRM_SITE_NAME="${siteName}"`,
    `window._AQRM_BASE_URL="${env.NEXT_PUBLIC_BASE_URL}"`,
    scriptFile,
  ].join(';')
}
