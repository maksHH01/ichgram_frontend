import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import AvatarWithBorder from "../AvatarWithBorder/AvatarWithBorder";
import BioWithToggle from "../BioWithToggle/BioWithToggle";
import styles from "./PostComponent.module.css";

import likeIcon from "../../../assets/svg/icon-notificationPost.svg";
import commentIcon from "../../../assets/svg/comment.svg";

import avatar from "../../../assets/images/no-profile-pic.jpg";
import postPhoto from "../../../assets/images/post-photo.png";

const PostComponent = ({ post, onPostUpdate }) => {
  // создаём дефолтный пост, если пропс не передан
  const defaultPost = {
    _id: "1",
    author: { username: "Unknown", avatarUrl: avatar },
    likes: [],
    comments: [],
    caption: "",
    imageUrl: postPhoto,
  };

  const actualPost = post || defaultPost;
  const likesCount = actualPost.likes.length;

  const location = useLocation();
  const [showAllComments, setShowAllComments] = useState(false);

  const getImageSrc = (url) => url || "/images/default-post.jpg";

  return (
    <div className={styles.post}>
      <div className={styles.header}>
        <AvatarWithBorder src={actualPost.author.avatarUrl} size={30} />
        <div className={styles.authorDetails}>
          <strong>{actualPost.author.username}</strong>
        </div>
      </div>

      <div className={styles.imageWrapper}>
        <Link to={`/posts/${actualPost._id}`} state={{ background: location }}>
          <img
            src={getImageSrc(actualPost.imageUrl)}
            alt="Post"
            style={{ cursor: "pointer" }}
          />
        </Link>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconButton} type="button">
          <img src={likeIcon} alt="Like" className={styles.icon} />
        </button>

        <Link to={`/posts/${actualPost._id}`} state={{ background: location }}>
          <img src={commentIcon} className={styles.icon} alt="Comments" />
        </Link>
      </div>

      <div className={styles.likes}>{likesCount} likes</div>

      <div className={styles.caption}>
        <strong>{actualPost.author.username}</strong>{" "}
        <BioWithToggle text={actualPost.caption} />
      </div>

      {actualPost.comments.length > 0 && !showAllComments && (
        <div
          className={styles.viewAll}
          onClick={() => setShowAllComments(true)}
          style={{ cursor: "pointer" }}
        >
          View all comments ({actualPost.comments.length})
        </div>
      )}

      {showAllComments &&
        actualPost.comments.map((comment, idx) => (
          <div key={idx} className={styles.comment}>
            <strong>{comment.author?.username || "Unknown"}</strong>{" "}
            {comment.text}
          </div>
        ))}
    </div>
  );
};

export default PostComponent;
