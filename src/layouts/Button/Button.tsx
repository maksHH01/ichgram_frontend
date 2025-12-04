import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  color?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  color = "primary",
  loading = false,
  disabled = false,
  type,
  onClick,
  className,
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[color]} ${className || ""}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? "Loading..." : text}
    </button>
  );
};

export default Button;
