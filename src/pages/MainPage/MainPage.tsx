import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import PostComponent from "../../shared/components/Post/PostComponent";
import PostsFinished from "../../shared/components/PostsFinished/PostsFinished";

import { getFeedPosts } from "../../shared/api/posts-api";
import type { Post } from "../../shared/types/Post";
import type { RootState } from "../../redux/store";

import styles from "./MainPage.module.css";

const MainPage = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchPosts = async () => {
      try {
        const data = await getFeedPosts(token);
        setPosts(data);
      } catch (error) {
        console.error("Failed to load posts:", error);
      }
    };

    fetchPosts();
  }, [token]);

  const handlePostUpdate = (updatedPost: Post) => {
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
