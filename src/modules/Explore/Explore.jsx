import React, { useEffect, useState } from "react";
import styles from "./Explore.module.css";

import { useNavigate, useLocation } from "react-router-dom";

import postPhoto from "../../assets/images/post-photo.png";
// import getExplorePosts from API, или оставь заглушки

const mockPosts = [
  { _id: "1", imageUrl: postPhoto },
  { _id: "2", imageUrl: postPhoto },
  { _id: "3", imageUrl: postPhoto },
  { _id: "4", imageUrl: postPhoto },
  { _id: "5", imageUrl: postPhoto },
  { _id: "6", imageUrl: postPhoto },
  { _id: "7", imageUrl: postPhoto },
  { _id: "8", imageUrl: postPhoto },
  { _id: "9", imageUrl: postPhoto },
  { _id: "10", imageUrl: postPhoto },
];

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Вместо API пока заглушки
    setPosts(mockPosts);
  }, []);

  const openPostModal = (postId) => {
    navigate(`/posts/${postId}`, { state: { background: location } });
  };

  return (
    <div className={styles.grid}>
      {posts.map((post, index) => (
        <div
          key={post._id}
          className={index % 4 === 2 ? styles.itemWide : styles.itemSquare}
          onClick={() => openPostModal(post._id)}
        >
          <img className={styles.postImage} src={post.imageUrl} alt="explore" />
        </div>
      ))}
    </div>
  );
};

export default Explore;
