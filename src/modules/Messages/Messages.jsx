import React from "react";
import styles from "./Messages.module.css";

const Messages = () => {
  return (
    <div className={styles.messagesPage}>
      <div className={styles.chatList}>
        <div className={styles.chatListHeader}>itcareerhub</div>

        <div className={`${styles.chatItem} ${styles.active}`}>
          <img
            className={styles.avatarSm}
            src="/moc/alex.jpg"
            alt="userMessageAvatar"
          />
          <div className={styles.chatInfo}>
            <div className={styles.chatName}>Alex</div>
            <div className={styles.chatLast}>
              Alex sent a message • 2 weeks ago
            </div>
          </div>
        </div>

        <div className={styles.chatItem}>
          <img className={styles.avatarSm} src="/moc/john.jpg" alt="John" />
          <div className={styles.chatInfo}>
            <div className={styles.chatName}>John</div>
            <div className={styles.chatLast}>
              John sent a message • 2 weeks ago
            </div>
          </div>
        </div>
      </div>

      <section className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          <img
            className={styles.headerAvatar}
            src="/moc/alex.jpg"
            alt="Alex avatar"
          />
          <div className={styles.headerTitle}>Alex</div>
        </div>

        <div className={styles.userHero}>
          <img
            className={styles.heroAvatar}
            src="/moc/alex.jpg"
            alt="Alex avatar"
          />
          <div className={styles.heroName}>Alex</div>
          <div className={styles.heroSub}>alex • ICHgram</div>
          <button className={styles.viewProfile}>View Profile</button>
        </div>

        <div className={styles.chatDate}>Jun 26, 2024, 08:49 PM</div>

        <div className={styles.chatMessages}>
          <div className={`${styles.row} ${styles.leftRow}`}>
            <img className={styles.msgAvatar} src="/moc/alex.jpg" alt="Alex" />
            <div className={`${styles.message} ${styles.left}`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>

          <div className={`${styles.row} ${styles.rightRow}`}>
            <div className={`${styles.message} ${styles.right}`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
            <img
              className={styles.msgAvatar}
              src="no-profile-pic-icon-11.jpg"
              alt="myAvatar"
            />
          </div>
        </div>

        <div className={styles.chatInput}>
          <input type="text" placeholder="Write a message" />
        </div>
      </section>
    </div>
  );
};

export default Messages;
