/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'github.com',
          pathname: '/cosmos-capstone/frontend/**',
        },
    ],
    domains: ['github.com', 'raw.githubusercontent.com']
    },
  };
  

  
  export default nextConfig;
  