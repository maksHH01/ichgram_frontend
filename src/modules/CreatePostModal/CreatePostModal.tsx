import React, {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addNewPost } from "../../redux/posts/posts-thunks";
import { setShouldReloadPosts } from "../../redux/posts/posts-slice";
import { RootState, AppDispatch } from "../../redux/store";

import { useFooterScrollAdjust } from "../../shared/hooks/useFooterScrollAdjust";
import EmojiPickerButton from "../../shared/components/EmojiButton/EmojiButton";
import GradientAvatar from "../../shared/components/GradientAvatar/GradientAvatar";

import styles from "./CreatePostModal.module.css";

const MAX_CAPTION_LENGTH = 2200;

const CreatePostModal: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useFooterScrollAdjust();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const author = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleEmojiInsert = (emoji: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;

    const before = caption.slice(0, start);
    const after = caption.slice(end);

    const updated = before + emoji + after;
    setCaption(updated);

    requestAnimationFrame(() => {
      textareaRef.current!.focus();
      textareaRef.current!.selectionStart = textareaRef.current!.selectionEnd =
        start + emoji.length;
    });
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => navigate(-1);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedImage || !caption.trim()) return;
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("caption", caption);

    try {
      setIsSubmitting(true);
      await dispatch(addNewPost({ formData, token })).unwrap();
      dispatch(setShouldReloadPosts(true));
      navigate(-1);
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modalWrapper} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close modal"
          >
            <img src="/x-lg.svg" alt="Close" />
          </button>

          <h3 className={styles.modalTitle}>Create new post</h3>

          <button
            className={styles.shareBtn}
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedImage || !caption.trim()}
          >
            {isSubmitting ? "Posting..." : "Share"}
          </button>
        </div>

        <div className={styles.modal}>
          <div
            className={styles.photoSection}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className={styles.photo} />
            ) : (
              <div className={styles.uploadPlaceholder}>
                <div className={styles.imageBox}>
                  <img src="/upload-img.svg" alt="Upload" />
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          <div className={styles.infoSection}>
            {author && (
              <div className={styles.authorInfo}>
                <GradientAvatar src={author.avatarUrl} alt="avatar" size={28} />
                <p>{author.username}</p>
              </div>
            )}

            <EmojiPickerButton onSelect={handleEmojiInsert} />

            <div className={styles.form}>
              <div className={styles.captionCounter}>
                {caption.length}/{MAX_CAPTION_LENGTH}
              </div>
              <textarea
                className={styles.textarea}
                ref={textareaRef}
                placeholder="Add comment"
                value={caption}
                maxLength={MAX_CAPTION_LENGTH}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
