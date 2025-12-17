import React from "react";
import styles from "./Button.module.css";

const Button = ({
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
      className={`${styles.button} ${styles[color]} ${className || ""}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? "Loading..." : text}
    </button>
  );
};

export default Button;
