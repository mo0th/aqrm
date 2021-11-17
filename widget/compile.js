import { promises as fs, existsSync } from 'fs'
import path from 'path'

import postcss from 'postcss'
import postcssNesting from 'postcss-nesting'
import cssnano from 'cssnano'
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
  const processor = postcss([postcssNesting, cssnano])

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
  const result = await htmlnano.process(text)
  return result.html
}

const main = async () => {
  const css = await processStyles()
  const widgetHtml = await processHtml()
  const script = await processScript({ css, widgetHtml })
  const [gzipLength, brotliLength] = await Promise.all([gzipSize(script), brotliSize(script)])

  console.log(`CSS   : ${css.length}`)
  console.log(`HTML  : ${widgetHtml.length}`)
  console.log(`JS    : ${script.length - css.length - widgetHtml.length}`)
  console.log(`Bundle: ${script.length}`)
  console.log(`gzip  : ${gzipLength}`)
  console.log(`Brotli: ${brotliLength}`)

  if (!existsSync(path.join(process.cwd(), 'dist'))) {
    fs.mkdir(path.join(process.cwd(), 'dist'))
  }
  fs.writeFile(path.join(process.cwd(), 'dist', 'script.js'), script)
}

main()
