import { promises as fs, existsSync } from 'fs'
import path from 'path'

import postcss from 'postcss'
import postcssNesting from 'postcss-nesting'
import cssnano from 'cssnano'
import varCompress from 'postcss-variable-compress'
import hbs from 'handlebars'
import htmlnano from 'htmlnano'
import { minify } from 'terser'
import gzipSize from 'gzip-size'
import _brotliSize from 'brotli-size'

let brotliSize = _brotliSize
if (typeof brotliSize !== 'function') {
  brotliSize = brotliSize.default
}

/**
 * @param {string} fileName
 * @returns {Promise<string>}
 */
const getSourceFile = async fileName => {
  const buffer = await fs.readFile(path.join(process.cwd(), 'src', fileName))
  return buffer.toString()
}

/**
 * @returns {Promise<string>}
 */
const processStyles = async () => {
  const prefixes = ['aqrm', '_']
  const processor = postcss([
    postcssNesting,
    cssnano({ preset: 'default' }),
    varCompress([n => prefixes.some(prefix => n.startsWith(`--${prefix}`))]),
  ])

  const css = await getSourceFile('styles.css')

  const processed = await processor.process(css, { from: undefined })
  return processed.css
}

/**
 * @param {Record<string,string>} vars
 * @returns {Promise<string>}
 */
const processScript = async vars => {
  const text = await getSourceFile('script.js')
  const template = hbs.compile(text)
  const hydratedTemplate = template(vars)
  // return hydratedTemplate
  const minified = await minify(hydratedTemplate, { ecma: '2015' })
  return minified.code
}

const processHtml = async () => {
  const text = await getSourceFile('widget.html')
  const result = await htmlnano.process(text, {}, htmlnano.presets.max)
  return result.html
}

const main = async () => {
  const css = await processStyles()
  const widgetHtml = await processHtml()
  const script = await processScript({ css, widgetHtml })
  const [gzipLength, brotliLength] = await Promise.all([gzipSize(script), brotliSize(script)])

  console.table({
    CSS: css.length,
    HTML: widgetHtml.length,
    JS: script.length - css.length - widgetHtml.length,
    BUNDLE: script.length,
    GZIP: gzipLength,
    BROTLI: brotliLength,
  })

  if (!existsSync(path.join(process.cwd(), 'dist'))) {
    fs.mkdir(path.join(process.cwd(), 'dist'))
  }
  fs.writeFile(path.join(process.cwd(), 'dist', 'script.js'), script)
  fs.writeFile(path.join(process.cwd(), 'dist', 'styles.css'), css)
  fs.writeFile(path.join(process.cwd(), 'dist', 'widget.html'), widgetHtml)
}

main()
