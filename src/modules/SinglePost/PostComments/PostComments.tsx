import React from "react";
import GradientAvatar from "../../../shared/components/GradientAvatar/GradientAvatar";
import styles from "./PostComments.module.css";

interface IAuthor {
  username: string;
  avatarUrl?: string | null;
}

interface IComment {
  _id: string;
  author: IAuthor;
  text: string;
  likes?: string[];
  createdAt: string;
}

interface ICurrentUser {
  _id: string;
}

interface PostCommentsProps {
  comments: IComment[];
  currentUser: ICurrentUser | null;
  onLikeComment?: (commentId: string) => void;
  onUnlikeComment?: (commentId: string) => void;
  likedCommentsIds?: string[];
}

const getShortTimeAgo = (dateString: string | undefined): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;

  return `${Math.floor(diffInDays / 7)}w`;
};

const PostComments: React.FC<PostCommentsProps> = ({
  comments,
  currentUser,
  onLikeComment,
  onUnlikeComment,
  likedCommentsIds = [],
}) => {
  return (
    <div className={styles.commentsList}>
      {comments.map((comment) => {
        const isLiked = likedCommentsIds.includes(comment._id);
        const likesCount = comment.likes?.length || 0;
        const timeAgo = getShortTimeAgo(comment.createdAt);

        return (
          <div key={comment._id} className={styles.comment}>
            <GradientAvatar src={comment.author.avatarUrl} size={28} />
            <div className={styles.commentTextWrapper}>
              <div className={styles.commentContent}>
                <strong>{comment.author.username}</strong>
                <p>{comment.text}</p>
              </div>
              <div className={styles.commentMeta}>
                {timeAgo && <span>{timeAgo}</span>}
                {likesCount > 0 && (
                  <span>
                    {likesCount} {likesCount === 1 ? "like" : "likes"}
                  </span>
                )}
              </div>
            </div>
            {currentUser && (
              <button
                className={styles.likeButton}
                onClick={() =>
                  isLiked
                    ? onUnlikeComment?.(comment._id)
                    : onLikeComment?.(comment._id)
                }
              >
                <img
                  src={isLiked ? "/red-heart.svg" : "/like-con.svg"}
                  alt={isLiked ? "Liked" : "Not liked"}
                />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PostComments;
