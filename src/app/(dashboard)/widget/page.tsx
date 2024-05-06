'use client'

import Title from '~/components/shared/Title'
import Button from '~/components/ui/Button'
import { DEFAULT_COLORS, presets } from '~/lib/widget-themes'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { env } from '~/env'

const WidgetTestPage = () => {
  const [colors, setColors] = useState(DEFAULT_COLORS)
  const [showCss, setShowCss] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const trigger = useRef<HTMLDivElement>(null)

  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    let register

    type Widget = HTMLDivElement & { unregister: () => void }

    let widget: Widget | null = null

    let counter = 0

    setLoading(true)

    const loop = () => {
      register = (
        window as unknown as { _AQRM_REGISTER: (arg0: HTMLElement, arg1: HTMLElement) => Widget }
      )._AQRM_REGISTER

      counter++

      if ((!register && mountedRef.current) || !trigger.current) {
        timeout = setTimeout(loop, 10)
        return
      }

      widget = register(document.body, trigger.current)
      setLoading(false)
      trigger.current?.click()

      if (env.NEXT_PUBLIC_NODE_ENV !== 'production') {
        console.log(`took ${counter} tries`)
      }
    }

    timeout = setTimeout(loop, 10)

    return () => {
      widget?.unregister()
      clearTimeout(timeout)
    }
  }, [])

  const triggerElement = useMemo(() => {
    return (
      <span ref={trigger}>
        <Button variant="primary" loading={loading}>
          Trigger Popup
        </Button>
      </span>
    )
  }, [loading])

  const colorEntries = Object.entries(colors)

  const css = `:root {\n${colorEntries
    .map(([name, value]) => `  --aqrm-${name}: ${value};`)
    .join('\n')}\n}`

  const copyCss = async () => {
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <script src="/aqrm.js?s=lol" defer />

      <Title text="Theme Editor" />
      <h1 className="mb-8 text-4xl font-bold">Widget Theme Editor</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="p-8 space-y-6 bg-white shadow-lg rounded-2xl">
          <div className="space-y-4">
            {colorEntries.map(([name, value]) => (
              <Fragment key={name}>
                <label className="flex items-center pl-1 space-x-4 cursor-pointer" htmlFor={name}>
                  <div className="w-8 h-8 p-px -m-2 border-2 border-gray-800 border-dotted rounded">
                    <div style={{ backgroundColor: value }} className="w-full h-full rounded-sm" />
                  </div>
                  <div>{name}</div>
                </label>
                <input
                  className="sr-only"
                  type="color"
                  name={name}
                  id={name}
                  value={value}
                  onChange={e => {
                    setColors({ ...colors, [e.target.name]: e.target.value })
                  }}
                />
              </Fragment>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="muted" onClick={() => setShowCss(c => !c)}>
              {showCss ? 'Hide' : 'Show'} CSS
            </Button>
            <Button variant="muted" onClick={copyCss}>
              {copied ? 'Copied 📋' : 'Copy CSS'}
            </Button>
          </div>
          {showCss && <pre>{css}</pre>}
          <hr />
          <div>
            <h2 className="text-2xl font-bold">Presets</h2>
            <div className="pt-4" />
            <div className="-mt-4 -ml-4">
              {Object.entries(presets).map(([theme, themeColors]) => (
                <span key={theme} className="inline-block mt-4 ml-4">
                  <Button variant="muted" onClick={() => setColors(themeColors)}>
                    {theme}
                  </Button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="row-start-1 md:col-start-2">
          <div className="flex items-center justify-center max-h-[24rem] h-full sticky top-0">
            {triggerElement}
          </div>
        </div>
      </div>
      <style>{css}</style>
    </>
  )
}

export default WidgetTestPage
