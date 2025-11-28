import React from "react";
import DropPanel from "../../../layouts/DropPanel/DropPanel";
import noProfileImg from "../../../assets/images/no-profile-pic.jpg";
import styles from "./NotificationPanel.module.css";

const NotificationsPanel = ({ isOpen, onClose, notifications }) => {
  const renderNotificationText = (n) => {
    switch (n.type) {
      case "like":
        return "liked your post.";
      case "comment":
        return "commented on your post.";
      case "follow":
        return "started following you.";
      default:
        return "";
    }
  };

  return (
    <DropPanel isOpen={isOpen} onClose={onClose} title="Notifications">
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <>
          <p className={styles.subheading}>New</p> {/* Вот она */}
          <ul className={styles.list}>
            {notifications.map((n) => (
              <li key={n.id} className={styles.notification}>
                <img
                  src={n.sender.avatarUrl || noProfileImg}
                  alt={n.sender.username}
                  className={styles.avatar}
                />
                <div className={styles.text}>
                  <strong>{n.sender.username}</strong>{" "}
                  {renderNotificationText(n)}
                  <div className={styles.time}>{n.createdAt}</div>
                </div>
                {n.post && n.post.imageUrl && (
                  <img
                    src={n.post.imageUrl}
                    alt="thumb"
                    className={styles.thumb}
                  />
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </DropPanel>
  );
};

export default NotificationsPanel;
