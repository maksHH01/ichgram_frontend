import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLikePost } from "../../hooks/useLikePost";
import { useFollow } from "../../hooks/useFollow";
import { getDateLabel } from "../../../modules/SinglePost/SinglePost";
import GradientAvatar from "../GradientAvatar/GradientAvatar";
import BioWithToggle from "../../../modules/Profile/BioWithToggle/BioWithToggle";
import styles from "./Post.module.css";
import { getPostById } from "../../api/posts-api";

const PostComponent = ({ post, onPostUpdate }) => {
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.user);

  const [localPost, setLocalPost] = useState(post);
  const [localAuthor, setLocalAuthor] = useState(post.author);
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    setLocalPost(post);
    setLocalAuthor(post.author);
    setShowAllComments(false);
  }, [post]);

  const { isLiked, handleLike, handleUnlike, isProcessing } = useLikePost(
    localPost,
    (updatedPost) => {
      setLocalPost(updatedPost);
      setLocalAuthor(updatedPost.author);
      onPostUpdate(updatedPost);
    }
  );

  const { isFollowing, handleFollow, handleUnfollow } = useFollow(
    localAuthor,
    setLocalAuthor
  );

  const likesCount = localPost.likes.length.toLocaleString();
  const date = getDateLabel(localPost.createdAt);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  const getImageSrc = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${BACKEND_URL}${url}`;
  };

  const loadComments = async () => {
    if (commentsLoading) return;
    setCommentsLoading(true);
    try {
      const fullPost = await getPostById(localPost._id);
      setLocalPost(fullPost);
      setShowAllComments(true);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Путь к профилю пользователя
  const profilePath = `/users/${localAuthor.username}`;

  return (
    <div className={styles.post}>
      <div className={styles.header}>
        {/* Оборачиваем Аватар в Link */}
        <Link to={profilePath} className={styles.avatarLink}>
          <GradientAvatar src={localAuthor.avatarUrl} size={30} />
        </Link>

        <div className={styles.authorDetails}>
          {/* Оборачиваем Имя в Link */}
          <Link to={profilePath} className={styles.usernameLink}>
            <strong>{localAuthor.username}</strong>
          </Link>

          <span className={styles.date}>• {date} •</span>

          {currentUser && currentUser._id !== localAuthor._id && (
            <>
              <button
                className={styles.followBtn}
                onClick={isFollowing ? handleUnfollow : handleFollow}
                type="button"
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.imageWrapper}>
        <Link to={`/posts/${localPost._id}`} state={{ background: location }}>
          <img
            src={getImageSrc(localPost.imageUrl)}
            alt="Post"
            style={{ cursor: "pointer" }}
          />
        </Link>
      </div>

      <div className={styles.actions}>
        <button
          onClick={isLiked ? handleUnlike : handleLike}
          disabled={isProcessing}
          aria-label={isLiked ? "Unlike post" : "Like post"}
          className={styles.iconButton}
          type="button"
        >
          <img
            src={isLiked ? "/red-heart.svg" : "/like-con.svg"}
            alt={isLiked ? "Liked" : "Not liked"}
            className={styles.icon}
          />
        </button>

        <Link to={`/posts/${localPost._id}`} state={{ background: location }}>
          <img
            src="/comments-icon.svg"
            className={styles.icon}
            alt="Comments"
          />
        </Link>
      </div>

      <div className={styles.likes}>{likesCount} likes</div>

      <div className={styles.caption}>
        <Link to={profilePath} className={styles.usernameLink}>
          <strong>{localAuthor.username}</strong>
        </Link>{" "}
        <BioWithToggle text={localPost.caption || ""} />
      </div>

      {localPost.comments &&
        localPost.comments.length > 0 &&
        !showAllComments && (
          <div
            className={styles.viewAll}
            onClick={loadComments}
            style={{
              cursor: commentsLoading ? "wait" : "pointer",
              userSelect: "none",
              opacity: commentsLoading ? 0.6 : 1,
            }}
          >
            {commentsLoading
              ? "Loading comments..."
              : `View all comments (${localPost.comments.length})`}
          </div>
        )}

      {showAllComments &&
        localPost.comments &&
        localPost.comments.map((comment) => (
          <div key={comment._id} className={styles.comment}>
            <Link
              to={`/users/${comment.author?.username}`}
              className={styles.usernameLink}
            >
              <strong>{comment.author?.username || "Unknown"}</strong>
            </Link>{" "}
            {comment.text}
          </div>
        ))}
    </div>
  );
};

export default PostComponent;
