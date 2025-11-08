/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile ESM packages from the three.js ecosystem
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    'three-stdlib',
    'three-mesh-bvh',
  ],
}

export default nextConfig
