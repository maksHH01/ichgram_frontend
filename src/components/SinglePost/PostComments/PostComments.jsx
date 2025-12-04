import React from "react";
import GradientAvatar from "../../../layouts/GradientAvatar/GradientAvatar";
import styles from "./PostComments.module.css";

const PostComments = ({
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

        return (
          <div key={comment._id} className={styles.comment}>
            <GradientAvatar src={comment.author.avatarUrl} size={28} />
            <div className={styles.commentContent}>
              <strong>{comment.author.username}</strong>
              <p>{comment.text}</p>
            </div>
            {currentUser && (
              <button
                className={styles.likeButton}
                onClick={() =>
                  isLiked
                    ? onUnlikeComment?.(comment._id)
                    : onLikeComment?.(comment._id)
                }
                aria-label={isLiked ? "Unlike comment" : "Like comment"}
              >
                <img
                  src={isLiked ? "/like-filled.svg" : "/like-con.svg"}
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
