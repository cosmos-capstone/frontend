/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'github.com',
          pathname: '/cosmos-capstone/frontend/**', // 깃허브 레포지토리 경로에 맞게 수정
        },
    ],
    domains: ['github.com', 'raw.githubusercontent.com']
    },
  };
  

  
  export default nextConfig;
  