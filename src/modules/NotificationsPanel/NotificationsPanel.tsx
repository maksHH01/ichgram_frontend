import React, { useEffect, useState } from "react";
import DropdownPanel from "../../shared/components/DropdownPanel/DropdownPanel";
import styles from "./NotificationsPanel.module.css";
import { getNotifications } from "../../shared/api/notifications-api";
import { getDateLabel } from "../SinglePost/SinglePost";
import { useNavigate, useLocation, Location } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

interface ISender {
  _id: string;
  username: string;
  avatarUrl?: string;
}

interface IPost {
  _id: string;
  imageUrl?: string;
}

interface INotification {
  _id: string;
  type: "like" | "comment" | "follow" | "likeOnComment";
  sender: ISender | null;
  post: IPost | null;
  createdAt: string;
  isRead: boolean;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

interface DecodedToken {
  id: string;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
  token,
  setUnreadCount,
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const navigate = useNavigate();
  const location = useLocation() as Location;

  const filterAndDeduplicate = (
    rawNotifications: INotification[]
  ): INotification[] => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const recent = rawNotifications.filter((n) => {
      return new Date(n.createdAt).getTime() > sevenDaysAgo;
    });

    const uniqueMap = new Map<string, INotification>();

    recent.forEach((n) => {
      const senderId = n.sender?._id;
      const postId = n.post?._id || "general";
      const key = `${senderId}-${n.type}-${postId}`;

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, n);
      } else {
        const existing = uniqueMap.get(key)!;
        if (new Date(n.createdAt) > new Date(existing.createdAt)) {
          uniqueMap.set(key, n);
        }
      }
    });

    return Array.from(uniqueMap.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  useEffect(() => {
    if (!token) return;

    try {
      const { id: userId } = jwtDecode<DecodedToken>(token);
      const socket: Socket = io(BACKEND_URL, {
        path: "/socket.io",
        transports: ["polling", "websocket"],
        auth: { token },
      });

      socket.emit("join", userId);

      socket.on("newNotification", (notification: INotification) => {
        setNotifications((prev) => {
          const combined = [notification, ...prev];
          const processed = filterAndDeduplicate(combined);

          const isActuallyNew = processed.some(
            (n) => n._id === notification._id
          );
          if (isActuallyNew) {
            setUnreadCount((count) => count + 1);
          }
          return processed;
        });
      });

      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.error("Failed to decode token or connect socket:", error);
    }
  }, [token, setUnreadCount]);

  useEffect(() => {
    if (!isOpen || !token) return;

    getNotifications(token)
      .then((data: any[]) => {
        if (!Array.isArray(data)) return;

        const normalized: INotification[] = data.map((n) => ({
          ...n,
          post: typeof n.post === "string" ? { _id: n.post } : n.post,
        }));

        const cleanList = filterAndDeduplicate(normalized);
        setNotifications(cleanList);
      })
      .catch(console.error);
  }, [isOpen, token]);

  useEffect(() => {
    if (isOpen && token && notifications.length > 0) {
      const hasUnread = notifications.some((n) => !n.isRead);
      if (hasUnread) {
        fetch(`${BACKEND_URL}/api/notifications/read`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (res.ok) setUnreadCount(0);
          })
          .catch(console.error);
      }
    }
  }, [isOpen, token, setUnreadCount, notifications]);

  const handleGoToUser = (username: string): void => {
    onClose();
    navigate(`/users/${username}`);
  };

  const handleGoToPost = (postId: string): void => {
    onClose();
    navigate(`/posts/${postId}`, { state: { background: location } });
  };

  const renderNotificationText = (n: INotification): string => {
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
      {notifications.length > 0 && (
        <div className={styles.newHeaderLabel}>New</div>
      )}

      {notifications.length === 0 ? (
        <p className={styles.subheading}>No new notifications</p>
      ) : (
        <ul className={styles.list}>
          {notifications.map((n) => (
            <li key={n._id} className={styles.notification}>
              <div className={styles.avatarWrapper}>
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
                {!n.isRead && <div className={styles.newBadge}></div>}
              </div>

              <div className={styles.text}>
                <span
                  className={styles.username}
                  onClick={() => n.sender && handleGoToUser(n.sender.username)}
                  style={{ cursor: n.sender ? "pointer" : "default" }}
                >
                  {n.sender?.username || "Unknown User"}
                </span>{" "}
                {renderNotificationText(n)}
                <div className={styles.metaInfo}>
                  <span className={styles.time}>
                    {getDateLabel(n.createdAt)}
                  </span>
                </div>
              </div>

              {n.post?._id && (
                <img
                  onClick={() => handleGoToPost(n.post!._id)}
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
