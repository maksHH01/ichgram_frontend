import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  color?: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  color = "primary",
  loading = false,
  disabled = false,
  type = "button",
  className,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[color] || ""} ${className || ""}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? "Loading..." : text}
    </button>
  );
};

export default Button;
