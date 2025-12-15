import React, { useEffect, useState } from "react";
import DropdownPanel from "../../shared/components/DropdownPanel/DropdownPanel";
import styles from "./NotificationsPanel.module.css";
import { getNotifications } from "../../shared/api/notifications-api";
import { getDateLabel } from "../SinglePost/SinglePost";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const NotificationsPanel = ({ isOpen, onClose, token, setUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) return;
    const { id: userId } = jwtDecode(token);
    const socket = io(BACKEND_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token },
    });

    socket.emit("join", userId);

    socket.on("newNotification", (notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n._id === notification._id)) return prev;
        setUnreadCount((count) => count + 1);
        return [notification, ...prev];
      });
    });

    return () => socket.disconnect();
  }, [token, setUnreadCount]);

  useEffect(() => {
    if (!isOpen) return;
    getNotifications(token)
      .then((data) => {
        const normalized = data.map((n) => ({
          ...n,
          post:
            typeof n.post === "string" ? { _id: n.post, imageUrl: "" } : n.post,
        }));
        setNotifications(normalized);
      })
      .catch(console.error);
  }, [isOpen, token]);

  useEffect(() => {
    if (isOpen) {
      fetch(`${BACKEND_URL}/api/notifications/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => setUnreadCount(0));
    }
  }, [isOpen, token, setUnreadCount]);

  const handleGoToUser = (username) => {
    onClose();
    navigate(`/users/${username}`);
  };
  const handleGoToPost = (postId) => {
    if (!postId) return;
    onClose();
    navigate(`/posts/${postId}`, { state: { background: location } });
  };

  const renderNotificationText = (n) => {
    switch (n.type) {
      case "like":
        return "liked your post.";
      case "comment":
        return "commented on your post.";
      case "follow":
        return "started following you.";
      case "likeOnComment":
        return "liked your comment.";
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <DropdownPanel isOpen={isOpen} onClose={onClose} title="Notifications">
      {notifications.length === 0 ? (
        <p className={styles.subheading}>No new notifications</p>
      ) : (
        <ul className={styles.list}>
          {notifications.map((n) => (
            <li key={n._id} className={styles.notification}>
              <img
                onClick={() => n.sender && handleGoToUser(n.sender.username)}
                style={{ cursor: n.sender ? "pointer" : "default" }}
                src={
                  n.sender?.avatarUrl
                    ? `${BACKEND_URL}${n.sender.avatarUrl}`
                    : "/no-profile-pic-icon-11.jpg"
                }
                alt="avatar"
                className={styles.avatar}
              />

              <div className={styles.text}>
                <span
                  className={styles.username}
                  onClick={() => n.sender && handleGoToUser(n.sender.username)}
                  style={{ cursor: n.sender ? "pointer" : "default" }}
                >
                  {n.sender?.username || "Unknown User"}
                </span>{" "}
                {renderNotificationText(n)}
                <span className={styles.time}>{getDateLabel(n.createdAt)}</span>
              </div>

              {n.post?._id && (
                <img
                  onClick={() => handleGoToPost(n.post._id)}
                  style={{ cursor: "pointer" }}
                  src={
                    n.post?.imageUrl
                      ? `${BACKEND_URL}${n.post.imageUrl}`
                      : "/no-post-thumb.jpg"
                  }
                  alt="thumb"
                  className={styles.thumb}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </DropdownPanel>
  );
};

export default NotificationsPanel;
