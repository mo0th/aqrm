/** @type {import('next').NextConfig} */
const config = {
  async rewrites() {
    return [{ source: '/aqrm.js', destination: '/api/script' }]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = config
