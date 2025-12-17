import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./TextField.module.css";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        {...rest}
        autoComplete="off"
        className={`${styles.input} ${className || ""}`}
      />
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
