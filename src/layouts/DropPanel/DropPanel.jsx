import React from "react";
import styles from "./DropPanel.module.css";

const DropPanel = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        {children}
      </aside>
    </div>
  );
};

export default DropPanel;
