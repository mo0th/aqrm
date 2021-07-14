import { promises as fs } from 'fs'
import path from 'path'

export const buildWidgetScript = async (siteName: string): Promise<string> => {
  const scriptFile = (
    await fs.readFile(path.join(process.cwd(), 'widget', 'dist', 'script.js'))
  ).toString()

  return [
    `window._AQRM_SITE_NAME="${siteName}"`,
    `window._AQRM_BASE_URL="${process.env.NEXT_PUBLIC_BASE_URL}"`,
    scriptFile,
  ].join(';')
}
