import { useState } from 'react'
import Button from '../ui/Button'
import { env } from '~/env'

interface SiteScriptProps {
  siteName: string
}

const getScript = (name: string) =>
  `<!-- AQRM Script -->
<script async defer src="${env.NEXT_PUBLIC_BASE_URL}/aqrm.js?s=${encodeURIComponent(
    name
  )}"></script>

<!-- Popup Trigger -->
<button data-aqrm>Give Feedback</button>`

const SiteScript: React.FC<SiteScriptProps> = ({ siteName }) => {
  const [copied, setCopied] = useState(false)

  const copyScript = async () => {
    await navigator.clipboard.writeText(getScript(siteName))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative max-w-sm sm:max-w-none">
      <div className="absolute right-2 top-2">
        <Button size="sm" variant="muted" onClick={copyScript}>
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto bg-gray-200 rounded">
        <code>{getScript(siteName)}</code>
      </pre>
    </div>
  )
}

export default SiteScript
