import React from "react";
import { Link, useLocation, Location } from "react-router-dom";
import styles from "./ProfilePosts.module.css";

interface IPost {
  _id: string;
  imageUrl: string;
}

interface ProfilePostsProps {
  posts: IPost[];
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({ posts }) => {
  const location: Location = useLocation();

  if (!posts || posts.length === 0) {
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
};

export default ProfilePosts;
