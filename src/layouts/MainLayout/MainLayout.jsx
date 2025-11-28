import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../shared/components/SidebarMenu/SidebarMenu";
import Footer from "../../shared/components/Footer/Footer";

import styles from "./MainLayout.module.css";

const MainLayout = () => {
  return (
    <>
      <div className={styles.containerLayout}>
        <Sidebar />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
