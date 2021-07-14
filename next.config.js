if (!process.env.NEXT_PUBLIC_BASE_URL || !process.env.DATABASE_URL) {
  throw new Error('missing environment variables')
}

/** @type {import('next/dist/next-server/server/config-shared').NextConfig} */
const config = {
  async rewrites() {
    return [{ source: '/aqrm.js', destination: '/api/script' }]
  },
}

module.exports = config
