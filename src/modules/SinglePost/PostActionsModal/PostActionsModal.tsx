import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./PostActionsModal.module.css";
import { deletePost } from "../../../shared/api/posts-api";
import { setShouldReloadPosts } from "../../../redux/posts/posts-slice";

interface PostActionsModalProps {
  postId: string;
  onClose: () => void;
  onEditClick: () => void;
  onDeleted: () => Promise<void> | void;
}

interface RootState {
  auth: {
    token: string | null;
  };
}

const PostActionsModal: React.FC<PostActionsModalProps> = ({
  postId,
  onClose,
  onEditClick,
  onDeleted,
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      if (!token) throw new Error("No authentication token found");

      await deletePost(postId, token);
      dispatch(setShouldReloadPosts(true));
      await onDeleted();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        onClose();
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        onClose();
      });
  };

  const handleGoToPost = () => {
    window.location.href = `/posts/${postId}`;
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={handleModalClick}>
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
