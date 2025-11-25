import styles from "./Button.module.css";

const Button = ({
  text,
  color = "primary",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
}) => {
  const colors = ["primary", "secondary", "danger"];
  const buttonColor = colors.includes(color) ? color : "primary";
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[buttonColor]}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? "Loading..." : text}
    </button>
  );
};

export default Button;
