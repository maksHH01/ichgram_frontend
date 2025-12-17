import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import styles from "./ConfirmationPlaceholder.module.css";

interface ConfirmationPlaceholderProps {
  imageSrc?: string;
  title: string;
  message: string;
  showBackButton?: boolean;
}

const ConfirmationPlaceholder: React.FC<ConfirmationPlaceholderProps> = ({
  imageSrc = "/illo-confirm-refresh-light.png",
  title,
  message,
  showBackButton = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.confirmContainer}>
      <img src={imageSrc} alt="Confirmation illustration" />
      <h1>{title}</h1>
      <p className={styles.confirmText}>{message}</p>

      {showBackButton && (
        <Button
          text="Go Back"
          color="primary"
          onClick={() => navigate(-1)}
          className={styles.backButton}
        />
      )}
    </div>
  );
};

export default ConfirmationPlaceholder;
