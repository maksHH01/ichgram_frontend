import React from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <Link to="/dashboard" className={styles.link}>
          Home
        </Link>
        <Link to="/search" className={styles.link}>
          Search
        </Link>
        <Link to="/explore" className={styles.link}>
          Explore
        </Link>
        <Link to="/messages" className={styles.link}>
          Messages
        </Link>
        <Link to="/notifications" className={styles.link}>
          Notifications
        </Link>
        <Link to="/create-new-post" className={styles.link}>
          Create
        </Link>
      </nav>
      <p className={styles.copy}>&copy; 2025 ICHgram</p>
    </footer>
  );
};

export default Footer;
