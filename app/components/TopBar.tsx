'use client';

import React from 'react';
import { Search, Settings, Notifications } from '@mui/icons-material';

export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b-2 border-blue-500 bg-white">
      <span className="text-xl font-bold text-gray-800">Overview</span>
    </div>
  );
}
