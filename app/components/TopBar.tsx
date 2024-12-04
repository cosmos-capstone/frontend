'use client';

import React from 'react';
import Image from 'next/image'
import favicon from './favicon.png'

export default function TopBar() {
  return (
    <div className="flex items-center justify-start px-5 py-3 border-b-2 border-blue-500 bg-white">
      <Image
        className="rounded-full mr-2"
        src={favicon}
        alt="Logo"
        width={32}
      />
      <span className="text-xl font-bold text-gray-800">Cosmos</span>
    </div>
  );
}
