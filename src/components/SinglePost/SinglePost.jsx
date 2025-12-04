import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { getPostById, addCommentToPost } from "../../shared/api/posts-api";
import GradientAvatar from "../../layouts/GradientAvatar/GradientAvatar";
import PostComments from "./PostComments/PostComments";
import EmojiPickerButton from "../../layouts/EmojiButton/EmojiButton";
import PostActionsModal from "./PostActionsModal/PostActionsModal";
import EditPostModal from "../EditPostModal/EditPostModal";

import styles from "./SinglePost.module.css";
import { isToday, isYesterday, differenceInDays } from "date-fns";
import { useFollow } from "../../shared/hooks/useFollow";
import { useLikePost } from "../../shared/hooks/useLikePost";
import { useLikeComment } from "../../shared/hooks/useLikeComment";

export const getDateLabel = (createdAt) => {
  const date = new Date(createdAt);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  const daysAgo = differenceInDays(new Date(), date);
  return `${daysAgo} ${daysAgo === 1 ? "Day" : "Days"} ago`;
};

const SinglePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [commentText, setCommentText] = useState("");
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const textareaRef = useRef(null);

  const { isFollowing, handleFollow, handleUnfollow } = useFollow(
    author,
    setAuthor
  );

  const {
    isLiked,
    handleLike,
    handleUnlike,
    isProcessing: isPostProcessing,
  } = useLikePost(post, setPost);

  const {
    isCommentLiked,
    handleLikeComment,
    handleUnlikeComment,
    isProcessing: isCommentProcessing,
  } = useLikeComment(post, setPost);

  const fetchPost = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const data = await getPostById(postId);
      setPost(data);
      setAuthor(data.author);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchPost();
    return () => {
      document.body.style.overflow = "";
    };
  }, [postId]);

  const handleEmojiInsert = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const before = commentText.slice(0, start);
    const after = commentText.slice(end);

    const updated = before + emoji + after;
    setCommentText(updated);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    });
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !currentUser || !post || !token) return;

    try {
      const newComment = await addCommentToPost(
        post._id,
        commentText.trim(),
        token
      );

      setPost((prev) =>
        prev
          ? { ...prev, comments: [...(prev.comments || []), newComment] }
          : prev
      );

      setCommentText("");
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  const onClose = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <p>{error || "Post not found"}</p>
          <button className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.photoSection}>
          <img src={post.imageUrl} alt="Post" className={styles.photo} />
        </div>
        <div className={styles.infoSection}>
          <div className={styles.scrollableContent}>
            {author && (
              <div className={styles.authorInfo}>
                <Link
                  to={`/users/${author.username}`}
                  className={styles.authorLink}
                >
                  <GradientAvatar
                    src={author.avatarUrl || "/no-profile-pic-icon-11.jpg"}
                    alt="avatar"
                    size={28}
                  />
                </Link>
                <Link
                  to={`/users/${author.username}`}
                  className={styles.authorLink}
                >
                  <strong style={{ cursor: "pointer" }}>
                    {author.username}
                  </strong>
                </Link>

                {currentUser && currentUser._id !== author._id && (
                  <>
                    <span>•</span>
                    <button
                      className={styles.followBtn}
                      onClick={isFollowing ? handleUnfollow : handleFollow}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  </>
                )}
                {currentUser && currentUser._id === author._id && (
                  <button
                    onClick={() => setShowActions(true)}
                    className={styles.moreBtn}
                  >
                    <img src="/more-actions-btn.svg" alt="More" />
                  </button>
                )}
              </div>
            )}

            <div className={styles.postBlock}>
              {author && (
                <div className={styles.authorInfoShort}>
                  <GradientAvatar
                    src={author.avatarUrl || "/no-profile-pic-icon-11.jpg"}
                    alt="avatar"
                    size={28}
                  />
                  <span className={styles.userPost}>
                    <p style={{ cursor: "default", padding: "4px 0px" }}>
                      <strong>{author.username}</strong>{" "}
                      {post.caption || "No description"}
                    </p>
                  </span>
                </div>
              )}
            </div>

            <PostComments
              comments={post.comments || []}
              currentUser={currentUser}
              likedCommentsIds={
                post.comments
                  ?.filter((comment) =>
                    isCommentLiked(comment, currentUser?._id || "")
                  )
                  .map((c) => c._id) || []
              }
              onLikeComment={handleLikeComment}
              onUnlikeComment={handleUnlikeComment}
            />
          </div>

          <div className={styles.bottomBar}>
            <div className={styles.barLine}>
              <div className={styles.actions}>
                <img
                  src={isLiked ? "/like-filled.svg" : "/like-con.svg"}
                  alt="Like"
                  className={styles.icon}
                  onClick={
                    isPostProcessing
                      ? undefined
                      : isLiked
                      ? handleUnlike
                      : handleLike
                  }
                  style={{
                    cursor: isPostProcessing ? "not-allowed" : "pointer",
                  }}
                />

                <img
                  src="/comments-icon.svg"
                  alt="Comment"
                  className={styles.icon}
                />
              </div>

              <p className={styles.likes}>{post.likes?.length || 0} likes</p>
              <p className={styles.time}>{getDateLabel(post.createdAt)}</p>
            </div>

            <form
              className={styles.commentForm}
              onSubmit={async (e) => {
                e.preventDefault();
                await handleAddComment();
              }}
            >
              <EmojiPickerButton onSelect={handleEmojiInsert} />
              <textarea
                ref={textareaRef}
                placeholder="Add comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isCommentProcessing}
              />

              <button
                type="submit"
                disabled={!commentText.trim() || isCommentProcessing}
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {showActions && (
          <PostActionsModal
            postId={post._id}
            onClose={() => setShowActions(false)}
            onEditClick={() => {
              setShowActions(false);
              setIsEditing(true);
            }}
            onDeleted={async () => {
              setShowActions(false);
              await new Promise((resolve) => setTimeout(resolve, 1000));
              navigate(`/users/${author?.username}`);
            }}
          />
        )}

        {isEditing && (
          <EditPostModal
            postId={post._id}
            initialCaption={post.caption || ""}
            previewUrl={post.imageUrl}
            onClose={() => setIsEditing(false)}
            onSaved={async () => {
              await fetchPost();
              setIsEditing(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SinglePost;
