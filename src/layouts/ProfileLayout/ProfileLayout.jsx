import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../shared/components/SidebarMenu/SidebarMenu";
import Footer from "../../shared/components/Footer/Footer";

import styles from "./ProfileLayout.module.css";

const ProfileLayout = () => {
  return (
    <>
      <div className={styles.containerLayout}>
        <Sidebar />
        <main className={styles.profileContent}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ProfileLayout;
