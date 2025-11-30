import styles from "./Messages.module.css";

import noPhoto from "../../assets/images/no-profile-pic.jpg";

const Messages = () => {
  return (
    <div className={styles.messagesPage}>
      <div className={styles.chatList}>
        <div className={styles.chatListHeader}>itcareerhub</div>

        <div className={`${styles.chatItem} ${styles.active}`}>
          <img className={styles.avatarSm} src={noPhoto} alt="Mary" />
          <div className={styles.chatInfo}>
            <div className={styles.chatName}>Mary</div>
            <div className={styles.chatLast}>Mary sent a message • 2 week</div>
          </div>
        </div>

        <div className={styles.chatItem}>
          <img className={styles.avatarSm} src={noPhoto} alt="sashaa" />
          <div className={styles.chatInfo}>
            <div className={styles.chatName}>sashaa</div>
            <div className={styles.chatLast}>
              Sashaa sent a message • 2 week
            </div>
          </div>
        </div>
      </div>

      <section className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          <img className={styles.headerAvatar} src={noPhoto} alt="Mary" />
          <div className={styles.headerTitle}>Mary</div>
        </div>

        <div className={styles.userHero}>
          <img className={styles.heroAvatar} src={noPhoto} alt="Mary" />
          <div className={styles.heroName}>Mary</div>
          <div className={styles.heroSub}>mary • ICHgram</div>
          <button className={styles.viewProfile}>View profile</button>
        </div>

        <div className={styles.chatDate}>Jun 26, 2024, 08:49 PM</div>

        <div className={styles.chatMessages}>
          <div className={`${styles.row} ${styles.leftRow}`}>
            <img className={styles.msgAvatar} src={noPhoto} alt="Mary" />
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
            <img className={styles.msgAvatar} src={noPhoto} alt="Mary" />
          </div>
        </div>

        <div className={styles.chatInput}>
          <input type="text" placeholder="Write message" />
        </div>
      </section>
    </div>
  );
};

export default Messages;
