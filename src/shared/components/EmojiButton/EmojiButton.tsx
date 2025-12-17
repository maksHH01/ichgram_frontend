import { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import styles from "./EmojiButton.module.css";

type EmojiPickerButtonProps = {
  onSelect: (emoji: string) => void;
};

const EmojiPickerButton = ({ onSelect }: EmojiPickerButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const handleEmojiClick = (emojiData: EmojiClickData): void => {
    onSelect(emojiData.emoji);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (
        pickerRef.current &&
        e.target instanceof Node &&
        !pickerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      ref={pickerRef}
    >
      <button
        type="button"
        className={styles.iconButton}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img src="/emoji-icon.svg" alt="Emoji" />
      </button>
      {isOpen && (
        <div style={{ position: "absolute", bottom: "40px", zIndex: 10 }}>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            className={styles.customEmojiPicker}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;
