import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { selectAuthUser } from "../../redux/auth/auth-selectors";
import { logout } from "../../redux/auth/auth-thunks";
import Button from "../../layouts/Button/Button";
import { Link } from "react-router-dom";

import styles from "./SidebarMenu.module.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const Sidebar = ({
  onToggleNotifications,
  onToggleSearch,
  onClosePanels,
  activePanel,
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector(selectAuthUser);

  const handleLogout = async () => {
    onClosePanels();
    await dispatch(logout());
    navigate("/");
  };

  const isModalOpen = !!location.state?.background;

  const handlePanelClick = (panel) => {
    if (isModalOpen) {
      navigate(location.state.background.pathname);
    }

    if (activePanel === panel) {
      onClosePanels();
    } else {
      onClosePanels();
      if (panel === "search") onToggleSearch();
      if (panel === "notifications") onToggleNotifications();

      if (panel === "create") {
        const background = location.state?.background || location;
        navigate("/create-new-post", { state: { background } });
      }
    }
  };

  const menuItems = [
    {
      label: "Home",
      icon: "/sidebar/icon-home.svg",
      iconFilled: "/sidebar/icon-home-filled.svg",
      path: "/dashboard",
    },
    {
      label: "Search",
      icon: "/sidebar/icon-search.svg",
      iconFilled: "/sidebar/icon-search-filled.svg",
      panel: "search",
    },
    {
      label: "Explore",
      icon: "/sidebar/icon-explore.svg",
      iconFilled: "/sidebar/icon-explore-filled.svg",
      path: "/explore",
    },
    {
      label: "Messages",
      icon: "/sidebar/icon-messages.svg",
      iconFilled: "/sidebar/icon-messages-filled.svg",
      path: "/messages",
    },
    {
      label: "Notifications",
      icon: "/sidebar/icon-notification.svg",
      iconFilled: "/heart-fill.svg",
      panel: "notifications",
    },
    {
      label: "Create",
      icon: "/sidebar/icon-createpost.svg",
      iconFilled: "/sidebar/icon-createpost.svg",
      panel: "create",
    },
    {
      label: "Profile",
      icon: "/no-profile-pic-icon-11.jpg",
      iconFilled: "/no-profile-pic-icon-11.jpg",
      isAvatar: true,
      path: currentUser ? `/users/${currentUser.username}` : undefined,
    },
  ];

  const handleClick = (item, e) => {
    e.preventDefault();

    if (item.path) {
      onClosePanels();
      navigate(item.path);
      return;
    }

    if (item.panel) {
      handlePanelClick(item.panel);
      return;
    }

    if (item.label === "Profile" && currentUser) {
      onClosePanels();
      navigate(`/users/${currentUser.username}`);
      return;
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoWrapper}>
        <Link to="/dashboard" onClick={() => onClosePanels()}>
          <img src="/logo.svg" alt="ICHGRAM" className={styles.logo} />
        </Link>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isRouteActive =
            item.path && location.pathname.startsWith(item.path);
          const isPanelActive = item.panel && activePanel === item.panel;
          const isCreateActive =
            item.panel === "create" && location.pathname === "/create-new-post";

          const isActive = isRouteActive || isPanelActive || isCreateActive;
          const isHovered = hoveredItem === item.label;

          const imgSrc = item.isAvatar
            ? currentUser?.avatarUrl
              ? `${BACKEND_URL}${currentUser.avatarUrl}`
              : item.icon
            : isActive || isHovered
            ? item.iconFilled
            : item.icon;

          return (
            <Link
              to="#"
              key={item.label}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={(e) => handleClick(item, e)}
            >
              <img
                src={imgSrc}
                alt={item.label}
                className={item.isAvatar ? styles.avatarIcon : styles.icon}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.logoutWrapper}>
        <Button text="Log out" color="secondary" onClick={handleLogout} />
      </div>
    </aside>
  );
};

export default Sidebar;
