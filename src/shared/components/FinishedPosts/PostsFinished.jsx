import styles from "./PostsFinished.module.css";
import endLogo from "../../../assets/images/illo-confirm-refresh-light.png.png";

const PostsFinished = () => {
  return (
    <div className={styles.container}>
      <img src={endLogo} alt="End of posts" className={styles.icon} />
      <p className={styles.smallText}>You've seen all the updates</p>
      <p className={styles.mainText}>You have viewed all new publications</p>
    </div>
  );
};

export default PostsFinished;
