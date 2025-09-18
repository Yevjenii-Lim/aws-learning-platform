/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  output: 'standalone',
  // Configure API routes to handle larger file uploads
  experimental: {
    serverComponentsExternalPackages: ['@aws-sdk/client-s3'],
  },
  // Increase body size limit for API routes (default is 1MB)
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

module.exports = nextConfig 