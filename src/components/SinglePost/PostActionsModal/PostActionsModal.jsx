import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./PostActionsModal.module.css";
import { deletePost } from "../../../shared/api/posts-api";
import { setShouldReloadPosts } from "../../../redux/posts/posts-slice";

const PostActionsModal = ({ postId, onClose, onEditClick, onDeleted }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      if (!token) throw new Error("No token");

      await deletePost(postId, token);
      dispatch(setShouldReloadPosts(true));
      await onDeleted();
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(link);
    onClose();
  };

  const handleGoToPost = () => {
    window.location.href = `/posts/${postId}`;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.danger} onClick={handleDelete}>
          Delete
        </button>
        <button onClick={onEditClick}>Edit</button>
        <button onClick={handleGoToPost}>Go to post</button>
        <button onClick={handleCopyLink}>Copy link</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PostActionsModal;
