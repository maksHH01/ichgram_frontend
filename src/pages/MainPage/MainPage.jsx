import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import PostsFinished from "../../shared/components/FinishedPosts/PostsFinished";
import PostComponent from "../../shared/components/PostComponent/PostComponent";

import styles from "./MainPage.module.css";
import avatar from "../../assets/images/no-profile-pic.jpg";
import postPhoto from "../../assets/images/post-photo.png";

const MainPage = () => {
  const token = useSelector((state) => state.auth.token);
  const [posts, setPosts] = useState([]);

  // Заглушка постов для интерфейса
  const defaultPosts = Array.from({ length: 5 }).map((_, i) => ({
    _id: String(i + 1),
    author: { username: `User${i + 1}`, avatarUrl: avatar },
    likes: [],
    comments: [],
    caption: `This is a placeholder caption for post ${i + 1}.`,
    imageUrl: postPhoto,
  }));

  useEffect(() => {
    // Если токена нет, просто используем заглушки
    if (!token) {
      setPosts(defaultPosts);
      return;
    }

    // Здесь можно вставить fetch с бэкендом, когда он будет готов
    async function fetchPosts() {
      try {
        // const data = await getFeedPosts(token);
        // setPosts(data);

        // Пока что используем заглушки
        setPosts(defaultPosts);
      } catch (error) {
        console.error("Ошибка загрузки постов:", error);
        setPosts(defaultPosts); // fallback на заглушки
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
