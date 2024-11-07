import React from 'react';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';
import styles from './styles/page.module.css';
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
        <div className={styles.container}>
          <TopBar />
          <div className={styles.contentContainer}>
            <SideBar />
            <div className={styles.mainContent}>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
