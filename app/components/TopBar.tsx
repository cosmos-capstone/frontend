'use client';

import React from 'react';
import { Search, Settings, Notifications } from '@mui/icons-material';

export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b-2 border-blue-500 bg-white">
      <span className="text-xl font-bold text-gray-800">Overview</span>
      <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 mr-4 w-full max-w-lg">
        <Search className="text-gray-400 text-lg mr-2" />
        <input
          type="text"
          placeholder="Search for something"
          className="border-none outline-none bg-transparent text-gray-400 w-full"
        />
      </div>
      <div className="flex items-center">
        <Settings className="text-gray-400 text-lg mx-2 cursor-pointer" />
        <Notifications className="text-gray-400 text-lg mx-2 cursor-pointer" />
      </div>
    </div>
  );
}
