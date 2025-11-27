import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Button from "../Button/Button";
import styles from "./SidebarMenu.module.css";

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

const Sidebar = ({
  onToggleNotifications,
  onToggleSearch,
  onClosePanels,
  activePanel,
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
      panel: "search",
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
      panel: "notifications",
    },
    {
      label: "Create",
      icon: createLogo,
      iconFilled: createLogo,
      panel: "create",
    },
    {
      label: "Profile",
      icon: noProfilePic,
      iconFilled: noProfilePic,
      isAvatar: true,
    },
  ];

  const handleClick = (item, event) => {
    event.preventDefault();
    switch (item.label) {
      case "Home":
        navigate("/dashboard");
        onClosePanels();
        break;
      case "Explore":
        navigate("/explore");
        onClosePanels();
        break;
      case "Profile":
        navigate("/profile");
        onClosePanels();
        break;
      case "Search":
        onToggleSearch();
        break;
      case "Notifications":
        onToggleNotifications();
        break;
      case "Messages":
        navigate("/messages");
        break;
      case "Create":
        navigate("/create-new-post", { state: { background: location } });
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoWrapper}>
        <img
          src={mainLogo}
          alt="ICHGRAM Logo"
          className={styles.logo}
          onClick={() => navigate("/dashboard")}
        />
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isRouteActive =
            item.path && location.pathname.startsWith(item.path);
          const isPanelActive = item.panel && activePanel === item.panel;
          const isActive = isRouteActive || isPanelActive;
          const isHovered = hoveredItem === item.label;

          const imgOrIcon = isActive || isHovered ? item.iconFilled : item.icon;

          return (
            <Link
              to="#"
              key={item.label}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={(e) => handleClick(item, e)}
            >
              {typeof imgOrIcon === "string" ? (
                <img
                  src={imgOrIcon}
                  alt={item.label}
                  className={item.isAvatar ? styles.avatarIcon : styles.icon}
                />
              ) : (
                imgOrIcon
              )}

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* <div className={styles.logoutWrapper}>
        <Button text="Log out" color="danger" onClick={() => navigate("/")} />
      </div> */}
    </div>
  );
};

export default Sidebar;
