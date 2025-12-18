import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link, Location } from "react-router-dom";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { UnknownAction } from "redux";

import { selectAuthUser } from "../../redux/auth/auth-selectors";
import { logout } from "../../redux/auth/auth-thunks";
import Button from "../../shared/components/Button/Button";

import styles from "./SidebarMenu.module.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

interface SidebarProps {
  onToggleNotifications: () => void;
  onToggleSearch: () => void;
  onClosePanels: () => void;
  activePanel: string | null;
  unreadCount: number;
}

interface ICurrentUser {
  username: string;
  avatarUrl?: string;
}

interface RootState {
  auth: {
    user: ICurrentUser | null;
  };
}

interface LocationState {
  background?: Location;
}

interface IMenuItem {
  label: string;
  icon: string;
  iconFilled: string;
  path?: string;
  panel?: string;
  isAvatar?: boolean;
}

type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;

const Sidebar: React.FC<SidebarProps> = ({
  onToggleNotifications,
  onToggleSearch,
  onClosePanels,
  activePanel,
  unreadCount,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector(selectAuthUser);

  const handleLogout = async () => {
    onClosePanels();
    await dispatch(logout());
    navigate("/");
  };

  const isModalOpen = !!(location.state as LocationState)?.background;

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClosePanels();

    if (location.pathname === "/dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/dashboard");
    }
  };

  const handlePanelClick = (panel: string) => {
    const backgroundState = (location.state as LocationState)?.background;
    if (isModalOpen && backgroundState) {
      navigate(backgroundState.pathname);
    }

    if (activePanel === panel) {
      onClosePanels();
    } else {
      onClosePanels();
      if (panel === "search") onToggleSearch();
      if (panel === "notifications") onToggleNotifications();
      if (panel === "create") {
        const background = backgroundState || location;
        navigate("/create-new-post", { state: { background } });
      }
    }
  };

  const menuItems: IMenuItem[] = [
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

  const handleClick = (
    item: IMenuItem,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
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
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoWrapper}>
        <Link to="/dashboard" onClick={handleLogoClick}>
          <img src="/logo.svg" alt="ICHGRAM" className={styles.logo} />
        </Link>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          if (item.label === "Profile" && !currentUser) return null;

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
              to={item.path || "#"}
              key={item.label}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={(e) => handleClick(item, e)}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={imgSrc}
                  alt={item.label}
                  className={item.isAvatar ? styles.avatarIcon : styles.icon}
                />
                {item.panel === "notifications" && unreadCount > 0 && (
                  <span className={styles.badge}>{unreadCount}</span>
                )}
              </div>
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
