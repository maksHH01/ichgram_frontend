import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ScrollToTop from "./shared/components/ScrollToTop/ScrollToTop";

import { selectToken } from "./redux/auth/auth-selectors";
import { logout, getCurrent } from "./redux/auth/auth-thunks";

import Navigation from "./modules/Navigation";
import Footer from "./modules/Footer/Footer";
import Sidebar from "./modules/SidebarMenu/SidebarMenu";
import NotificationsPanel from "./modules/NotificationsPanel/NotificationsPanel";
import Search from "./modules/Search/Search";

import { setAuthHeader } from "./shared/api/setAuthHeader";

import "./shared/styles/reset.css";
import "./shared/styles/variables.css";
import "./shared/styles/common.css";

import styles from "./App.module.css";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [openPanel, setOpenPanel] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const togglePanel = (panel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  useEffect(() => {
    if (!token) return;

    setAuthHeader(token);

    dispatch(getCurrent())
      .unwrap()
      .catch((err) => {
        if (
          err === "jwt expired" ||
          err === "Unauthorized" ||
          (typeof err === "string" && err.includes("401"))
        ) {
          dispatch(logout());
          navigate("/login");
        }
      });

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const unread = data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      })
      .catch(console.error);
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
