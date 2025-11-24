import React, { useState } from "react";
import { useForm } from "react-hook-form";

import Button from "../../../../layouts/Button/Button";
import TextField from "../../../../layouts/TextField/TextField";
import styles from "../../Authentificate.module.css";

const LoginForm = ({ submitForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const [serverError, setServerError] = useState(null);

  const onSubmit = async (data) => {
    setServerError(null);
    const result = await submitForm(data);

    if (result.success) {
      reset();
    } else if (result.error) {
      const field = result.error.toLowerCase().includes("password")
        ? "password"
        : "identifier";

      setServerError({ field, message: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formfields}>
        <TextField
          placeholder="Email or Username"
          type="text"
          {...register("identifier", {
            required: "Введите email или имя пользователя",
          })}
        />
        {errors.identifier && (
          <p className={styles.errorMessage}>{errors.identifier.message}</p>
        )}
        {serverError?.field === "identifier" && (
          <p className={styles.errorMessage}>{serverError.message}</p>
        )}

        <TextField
          placeholder="Password"
          type="password"
          {...register("password", { required: "Введите пароль" })}
        />
        {errors.password && (
          <p className={styles.errorMessage}>{errors.password.message}</p>
        )}
        {serverError?.field === "password" && (
          <p className={styles.errorMessage}>{serverError.message}</p>
        )}
      </div>

      <Button type="submit" text="Log in" color="primary" />

      <div className={styles.separatorContainer}>
        <div className={styles.separator}></div>
        <span className={styles.orText}>OR</span>
        <div className={styles.separator}></div>
      </div>

      <a className={styles.link} href="/forgot-password">
        Forgot password?
      </a>
    </form>
  );
};

export default LoginForm;
