import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Footer.module.css";

type FooterProps = {
  onToggleSearch: () => void;
  onToggleNotifications: () => void;
  onClosePanels: () => void;
  activePanel: "search" | "notifications" | null;
};

const Footer: React.FC<FooterProps> = ({
  onToggleSearch,
  onToggleNotifications,
  onClosePanels,
  activePanel,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isModalOpen = !!(location.state as any)?.background;

  const resetState = () => {
    onClosePanels();
  };

  const handleSearch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (isModalOpen) {
      navigate((location.state as any).background.pathname);
    }

    if (activePanel === "search") {
      onClosePanels();
    } else {
      onClosePanels();
      onToggleSearch();
    }
  };

  const handleNotifications = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (isModalOpen) {
      navigate((location.state as any).background.pathname);
    }

    if (activePanel === "notifications") {
      onClosePanels();
    } else {
      onClosePanels();
      onToggleNotifications();
    }
  };

  const handleCreate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClosePanels();

    const background = (location.state as any)?.background || location;
    navigate("/create-new-post", { state: { background } });
  };

  const handleNavigation = () => {
    resetState();
  };

  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <Link to="/dashboard" className={styles.link} onClick={handleNavigation}>
          Home
        </Link>

        <Link to="#" className={styles.link} onClick={handleSearch}>
          Search
        </Link>

        <Link to="/explore" className={styles.link} onClick={handleNavigation}>
          Explore
        </Link>

        <Link to="/messages" className={styles.link} onClick={handleNavigation}>
          Messages
        </Link>

        <Link to="#" className={styles.link} onClick={handleNotifications}>
          Notifications
        </Link>

        <Link to="#" className={styles.link} onClick={handleCreate}>
          Create
        </Link>
      </nav>
      <p className={styles.copy}>&copy; 2025 ICHgram</p>
    </footer>
  );
};

export default Footer;
