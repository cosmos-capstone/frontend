'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dashboard, PieChart, BarChart } from '@mui/icons-material';

export default function SideBar() {
  const pathname = usePathname();

  return (
    <div className="w-[200px] h-screen bg-white shadow-md p-5 box-border">
      <nav className="flex flex-col">
        <MenuItem
          icon={<Dashboard />}
          text="Dashboard"
          path="/"
          isActive={pathname === '/'}
        />
        <MenuItem
          icon={<PieChart />}
          text="Portfolio"
          path="/portfolio"
          isActive={pathname === '/portfolio'}
        />
        <MenuItem
          icon={<BarChart />}
          text="Data Registration"
          path="/data-registration"
          isActive={pathname === '/data-registration'}
        />
      </nav>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  path: string;
  isActive: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, path, isActive }) => (
  <Link href={path}>
    <div
      className={`flex items-center p-3 mb-3 rounded-lg cursor-pointer transition-colors ${isActive
        ? 'bg-blue-50 text-blue-600 font-bold'
        : 'text-gray-500 hover:bg-gray-100'
        }`}
    >
      <span className="text-lg mr-3">{icon}</span>
      <span>{text}</span>
    </div>
  </Link>
);
