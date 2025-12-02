import { Link, useLocation } from "react-router-dom";

import styles from "./ProfilePosts.module.css";

import PostPhoto from "../../../assets/images/profile-post-foto.png";

export default function ProfilePosts({ posts }) {
  const location = useLocation();

  if (!posts || posts.length === 0) {
    return <p>У пользователя пока нет постов</p>;
  }

  return (
    <div className={styles.postGrid}>
      {posts.map((post) => (
        <div key={post._id} className={styles.postItem}>
          <Link to={`/posts/${post._id}`} state={{ background: location }}>
            <img src={PostPhoto} alt="Post" />
          </Link>
        </div>
      ))}
    </div>
  );
}
