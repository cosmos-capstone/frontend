import React from 'react';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';
import type { Metadata } from "next";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Cosmos",
  description: "Capstone design project",
};

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col h-screen">
          <TopBar />
          <div className="flex flex-1 overflow-hidden">
            <SideBar />
            <div className="flex flex-col flex-1 overflow-y-auto">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
