import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ScrollToTop from "./shared/components/ScrollToTop/ScrollToTop";

import { selectToken } from "./redux/auth/auth-selectors";
import { logout, getCurrent } from "./redux/auth/auth-thunks";
import type { AppDispatch } from "./redux/store";

import Navigation from "./modules/Navigation";
import Footer from "./modules/Footer/Footer";
import Sidebar from "./modules/SidebarMenu/SidebarMenu";
import NotificationsPanel from "./modules/NotificationsPanel/NotificationsPanel";
import Search from "./modules/Search/Search";

import { setAuthHeader } from "./shared/api/setAuthHeader";

import { getNotifications, Notification } from "./shared/api/notifications-api";

import "./shared/styles/reset.css";
import "./shared/styles/variables.css";
import "./shared/styles/common.css";

import styles from "./App.module.css";

type PanelType = "search" | "notifications" | null;

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [openPanel, setOpenPanel] = useState<PanelType>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const togglePanel = (panel: "search" | "notifications") => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  useEffect(() => {
    if (!token) return;

    setAuthHeader(token);

    dispatch(getCurrent())
      .unwrap()
      .catch((err: unknown) => {
        const errorString = String(err);
        if (
          errorString.includes("jwt expired") ||
          errorString.includes("Unauthorized") ||
          errorString.includes("401")
        ) {
          dispatch(logout());
          navigate("/login");
        }
      });

    getNotifications(token)
      .then((data: Notification[]) => {
        if (!Array.isArray(data)) {
          console.warn("Получен некорректный формат уведомлений:", data);
          return;
        }

        const unread = data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      })
      .catch((err: unknown) => {
        console.error("Ошибка загрузки уведомлений:", err);
      });
  }, [token, dispatch, navigate]);

  return (
    <>
      <ScrollToTop />
      {token && (
        <div className={styles.appLayout}>
          <Sidebar
            onToggleNotifications={() => togglePanel("notifications")}
            onToggleSearch={() => togglePanel("search")}
            onClosePanels={() => setOpenPanel(null)}
            activePanel={openPanel}
            unreadCount={unreadCount}
          />

          <NotificationsPanel
            isOpen={openPanel === "notifications"}
            onClose={() => setOpenPanel(null)}
            token={token}
            setUnreadCount={setUnreadCount}
          />

          <Search
            isOpen={openPanel === "search"}
            onClose={() => setOpenPanel(null)}
          />

          <div className={styles.mainContent}>
            <Navigation />
          </div>
        </div>
      )}

      {!token && <Navigation />}

      {token && (
        <Footer
          onToggleNotifications={() => togglePanel("notifications")}
          onToggleSearch={() => togglePanel("search")}
          onClosePanels={() => setOpenPanel(null)}
          activePanel={openPanel}
        />
      )}
    </>
  );
}

export default App;
