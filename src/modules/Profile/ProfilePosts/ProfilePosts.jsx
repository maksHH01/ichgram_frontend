import { Link, useLocation } from "react-router-dom";

import styles from "./ProfilePosts.module.css";

export default function ProfilePosts({ posts }) {
  const location = useLocation();

  if (!posts.length) {
    return <p className={styles.noPosts}>This profile has no posts yet</p>;
  }

  return (
    <div className={styles.postGrid}>
      {posts.map((post) => (
        <div key={post._id} className={styles.postItem}>
          <Link to={`/posts/${post._id}`} state={{ background: location }}>
            <img src={post.imageUrl} alt="Post" />
          </Link>
        </div>
      ))}
    </div>
  );
}
