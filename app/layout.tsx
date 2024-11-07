import React from 'react';
import TopBar from './topBar';
import Sidebar from './sideBar';
import styles from './styles/page.module.css';
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cosmos",
  description: "Capstone design project",
};

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className={styles.container}>
          <TopBar />
          <div className={styles.contentContainer}>
            <Sidebar />
            <div className={styles.mainContent}>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
