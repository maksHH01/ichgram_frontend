import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { isToday, isYesterday, differenceInDays } from "date-fns";

import { useFooterScrollAdjust } from "../../shared/hooks/useFooterScrollAdjust";
import { getPostById, addCommentToPost } from "../../shared/api/posts-api";
import GradientAvatar from "../../shared/components/GradientAvatar/GradientAvatar";
import PostComments from "./PostComments/PostComments";
import EmojiPickerButton from "../../shared/components/EmojiButton/EmojiButton";
import PostActionsModal from "./PostActionsModal/PostActionsModal";
import EditPostModal from "../EditPostModal/EditPostModal";

import styles from "./SinglePost.module.css";
import { useFollow } from "../../shared/hooks/useFollow";
import { useLikePost } from "../../shared/hooks/useLikePost";
import { useLikeComment } from "../../shared/hooks/useLikeComment";

interface RootState {
  auth: {
    user: { _id: string; username: string } | null;
    token: string | null;
  };
}

interface PostCaptionProps {
  username: string;
  text: string | null | undefined;
}

export const getDateLabel = (createdAt: string): string => {
  const date = new Date(createdAt);
  if (!createdAt || isNaN(date.getTime())) return "";

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  const daysAgo = differenceInDays(new Date(), date);
  return `${daysAgo} ${daysAgo === 1 ? "Day" : "Days"} ago`;
};

const PostCaption: React.FC<PostCaptionProps> = ({ username, text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 50;

  if (!text) return null;

  if (text.length <= MAX_LENGTH) {
    return (
      <p style={{ cursor: "default", padding: "4px 0px" }}>
        <strong>{username}</strong> {text}
      </p>
    );
  }

  return (
    <p style={{ cursor: "default", padding: "4px 0px" }}>
      <strong>{username}</strong>{" "}
      {isExpanded ? text : `${text.slice(0, MAX_LENGTH)}...`}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          border: "none",
          background: "none",
          color: "#8e8e8e",
          cursor: "pointer",
          marginLeft: "4px",
          padding: 0,
          fontSize: "inherit",
          fontFamily: "inherit",
          fontWeight: "600",
        }}
      >
        {isExpanded ? "less" : "more"}
      </button>
    </p>
  );
};

const SinglePost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  useFooterScrollAdjust();

  const [post, setPost] = useState<any | null>(null);
  const [author, setAuthor] = useState<any | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  const handleEmojiInsert = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const updated =
      commentText.slice(0, start) + emoji + commentText.slice(end);
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
      setPost((prev: any) =>
        prev
          ? { ...prev, comments: [...(prev.comments || []), newComment] }
          : prev
      );
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  const onToggleFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!author || !currentUser) return;

    if (isFollowing) {
      await handleUnfollow();
    } else {
      await handleFollow();
    }
  };

  const onClose = () => navigate(-1);

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
                      onClick={onToggleFollow}
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
                    <PostCaption
                      username={author.username}
                      text={post.caption || ""}
                    />
                  </span>
                </div>
              )}
            </div>
            <PostComments
              comments={post.comments || []}
              currentUser={currentUser}
              likedCommentsIds={
                post.comments
                  ?.filter((comment: any) =>
                    isCommentLiked(comment, currentUser?._id || "")
                  )
                  .map((c: any) => c._id) || []
              }
              onLikeComment={handleLikeComment}
              onUnlikeComment={handleUnlikeComment}
            />
          </div>
          <div className={styles.bottomBar}>
            <div className={styles.barLine}>
              <div className={styles.actions}>
                <img
                  src={isLiked ? "/red-heart.svg" : "/like-con.svg"}
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
              onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                await handleAddComment();
              }}
            >
              <EmojiPickerButton onSelect={handleEmojiInsert} />
              <textarea
                ref={textareaRef}
                placeholder="Add comment"
                value={commentText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setCommentText(e.target.value)
                }
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
