import MainLayout from '@/components/layouts/MainLayout'
import Title from '@/components/shared/Title'
import Button from '@/components/ui/Button'
import Head from 'next/head'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'

const DEFAULT_COLORS = {
  primary: '#a78bfa',
  'primary-dark': '#8b5cf6',
  'primary-contrast': '#ffffff',
  base: '#e5e7eb',
  'base-dark': '#d1d5db',
  'base-darker': '#9ca3af',
  'issue-1': '#fcd34d',
  'issue-2': '#78350f',
  'idea-1': '#fcd34d',
  'idea-2': '#78350f',
  'other-1': '#78350f',
  'success-1': '#22db69',
  'success-2': '#ffffff',
}

const WidgetTestPage: React.FC = () => {
  const [colors, setColors] = useState(DEFAULT_COLORS)
  const [showCss, setShowCss] = useState(false)
  const [copied, setCopied] = useState(false)
  const trigger = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let numTries = 0
    let complete = false
    let widget: any

    while (numTries < 5 && !complete) {
      const register = (window as any)._AQRM_REGISTER
      if (!register) {
        numTries++
        continue
      }

      widget = register(document.body, trigger.current)

      complete = true
    }

    return () => {
      widget?.unregister()
    }
  }, [])

  const triggerElement = useMemo(() => {
    return (
      <span ref={trigger}>
        <Button variant="primary">Trigger Popup</Button>
      </span>
    )
  }, [])

  const css = `:root {\n${Object.entries(colors)
    .map(([name, value]) => `  --aqrm-${name}: ${value};`)
    .join('\n')}\n}`

  const copyCss = async () => {
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <MainLayout>
      <Head>
        <script src={`${process.env.NEXT_PUBLIC_BASE_URL}/aqrm.js?s=lol`} defer />
      </Head>
      <Title text="Theme Editor" />
      <h1 className="mb-8 text-4xl font-bold">Widget Theme Editor</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="p-8 bg-white shadow-lg rounded-2xl">
          <div className="space-y-4">
            {Object.entries(colors).map(([name, value]) => (
              <Fragment key={name}>
                <label className="flex items-center pl-1 space-x-4 cursor-pointer" htmlFor={name}>
                  <div style={{ background: value }} className="w-8 h-8 outline-black" />
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
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button variant="muted" onClick={() => setShowCss(c => !c)}>
              {showCss ? 'Hide' : 'Show'} CSS
            </Button>
            <Button variant="muted" onClick={copyCss}>
              {copied ? 'Copied' : 'Copy CSS'}
            </Button>
          </div>
          {showCss && <pre className="mt-4">{css}</pre>}
        </div>
        <div className="row-start-1 md:col-start-2">
          <div className="flex items-center justify-center max-h-[24rem] h-full sticky top-0">
            {triggerElement}
          </div>
        </div>
      </div>
      <style jsx>{`
        :global(body) {
          --aqrm-primary: ${colors['primary']};
          --aqrm-primary-dark: ${colors['primary-dark']};
          --aqrm-primary-contrast: ${colors['primary-contrast']};
          --aqrm-base: ${colors['base']};
          --aqrm-base-dark: ${colors['base-dark']};
          --aqrm-base-darker: ${colors['base-darker']};
          --aqrm-issue-1: ${colors['issue-1']};
          --aqrm-issue-2: ${colors['issue-2']};
          --aqrm-idea-1: ${colors['idea-1']};
          --aqrm-idea-2: ${colors['idea-2']};
          --aqrm-other-1: ${colors['other-1']};
          --aqrm-success-1: ${colors['success-1']};
          --aqrm-success-2: ${colors['success-2']};
        }
      `}</style>
    </MainLayout>
  )
}

export default WidgetTestPage
