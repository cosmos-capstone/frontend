import React from 'react';
import Image from 'next/image';

interface ImageWithBackgroundProps {
  src: string; // 이미지 경로
  alt: string; // 대체 텍스트
}

const ImageWithBackground: React.FC<ImageWithBackgroundProps> = ({ src, alt }) => {
  return (
    <div
      style={{
        backgroundColor: '#a86228', // 배경색 설정
        borderRadius: '15px', // 모서리를 둥글게
        padding: '20px', // 이미지 주변 여백
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100px', // 컨테이너 크기
        height: '100px',
      }}
    >
      <Image
        src={src}
        alt={alt}
        style={{
          borderRadius: '10px', // 이미지 모서리 둥글게
          objectFit: 'cover', // 이미지가 컨테이너에 맞게 채워짐
          width: '60px',
          height: '60px',
        }}
        width={60}
        height={60}
      />
    </div>
  );
};

export default ImageWithBackground;
