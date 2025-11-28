import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Button from "../Button/Button";
import NotificationsPanel from "../NotificationPanel/NotificationPanel";
import Search from "../Search/Search";

import styles from "./SidebarMenu.module.css";

// Icons / images
import mainLogo from "../../../assets/svg/main-logo.svg";
import homeLogo from "../../../assets/svg/icon-home.svg";
import homeLogoFilled from "../../../assets/svg/icon-home-filled.svg";
import searchLogo from "../../../assets/svg/icon-search.svg";
import searchLogoFilled from "../../../assets/svg/icon-search-filled.svg";
import exploreLogo from "../../../assets/svg/icon-explore.svg";
import exploreLogoFilled from "../../../assets/svg/icon-explore-filled.svg";
import messagesLogo from "../../../assets/svg/icon-messages.svg";
import messagesLogoFilled from "../../../assets/svg/icon-messages-filled.svg";
import notificateIcon from "../../../assets/svg/icon-notification.svg";
import notificateIconFilled from "../../../assets/svg/icon-notification-filled.svg";
import createLogo from "../../../assets/svg/icon-create.svg";
import noProfilePic from "../../../assets/images/no-profile-pic.jpg";

const Sidebar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Home",
      icon: homeLogo,
      iconFilled: homeLogoFilled,
      path: "/dashboard",
    },
    {
      label: "Search",
      icon: searchLogo,
      iconFilled: searchLogoFilled,
    },
    {
      label: "Explore",
      icon: exploreLogo,
      iconFilled: exploreLogoFilled,
      path: "/explore",
    },
    {
      label: "Messages",
      icon: messagesLogo,
      iconFilled: messagesLogoFilled,
      path: "/messages",
    },
    {
      label: "Notifications",
      icon: notificateIcon,
      iconFilled: notificateIconFilled,
    },
    {
      label: "Create",
      icon: createLogo,
      iconFilled: createLogo,
      path: "/create-new-post",
    },
    {
      label: "Profile",
      icon: noProfilePic,
      iconFilled: noProfilePic,
      isAvatar: true,
      path: "/profile",
    },
  ];

  const handleClick = (item, e) => {
    e.preventDefault();

    switch (item.label) {
      case "Home":
        navigate("/dashboard");
        break;

      case "Explore":
        navigate("/explore");
        break;

      case "Profile":
        navigate("/profile");
        break;

      case "Create":
        navigate("/create-new-post");
        break;

      case "Search":
        setIsSearchOpen(true);
        break;

      case "Notifications":
        setIsNotificationsOpen((prev) => !prev);
        break;

      default:
        if (item.path) navigate(item.path);
        break;
    }
  };

  const mockNotifications = [
    {
      id: "1",
      sender: { username: "Alice", avatarUrl: noProfilePic },
      type: "like",
      post: { imageUrl: noProfilePic },
      createdAt: "2h ago",
    },
    {
      id: "2",
      sender: { username: "Bob", avatarUrl: noProfilePic },
      type: "comment",
      post: { imageUrl: noProfilePic },
      createdAt: "3h ago",
    },
    {
      id: "3",
      sender: { username: "Charlie", avatarUrl: noProfilePic },
      type: "follow",
      post: null,
      createdAt: "5h ago",
    },
  ];

  return (
    <>
      <div className={styles.sidebar}>
        {/* Logo */}
        <div className={styles.logoWrapper}>
          <img
            src={mainLogo}
            alt="ICHGRAM Logo"
            className={styles.logo}
            onClick={() => navigate("/dashboard")}
          />
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {menuItems.map((item) => {
            const isHovered = hoveredItem === item.label;
            const iconToShow = isHovered ? item.iconFilled : item.icon;

            return (
              <Link
                to="#"
                key={item.label}
                className={styles.navItem}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={(e) => handleClick(item, e)}
              >
                <img
                  src={item.isAvatar ? noProfilePic : iconToShow}
                  alt={item.label}
                  className={item.isAvatar ? styles.avatarIcon : styles.icon}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Log out */}
        <div className={styles.logoutWrapper}>
          <Button
            text="Log out"
            color="secondary"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={mockNotifications}
      />

      {/* Search Panel */}
      <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Sidebar;
