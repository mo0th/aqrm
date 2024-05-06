/** @type {import('next/dist/next-server/server/config-shared').NextConfig} */
const config = {
  async rewrites() {
    return [{ source: '/aqrm.js', destination: '/api/script' }]
  },
}

module.exports = config
