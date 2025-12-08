import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import PostComponent from "../../shared/components/Post/PostComponent";
import PostsFinished from "../../shared/components/PostsFinished/PostsFinished";

import { getFeedPosts } from "../../shared/api/posts-api";

import styles from "./MainPage.module.css";

const MainPage = () => {
  const token = useSelector((state) => state.auth.token);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!token) return;

    async function fetchPosts() {
      try {
        const data = await getFeedPosts(token);
        setPosts(data);
      } catch (error) {
        console.error("Failed to load posts:", error);
      }
    }

    fetchPosts();
  }, [token]);

  const handlePostUpdate = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  return (
    <>
      <div className={styles.postsBox}>
        {posts.map((post) => (
          <PostComponent
            key={post._id}
            post={post}
            onPostUpdate={handlePostUpdate}
          />
        ))}
      </div>
      <PostsFinished />
    </>
  );
};

export default MainPage;
