import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TextField from "../../../../layouts/TextField/TextField";
import Button from "../../../../layouts/Button/Button";
import loginSchema from "./loginSchema";
import { selectAuth } from "../../../../redux/auth/auth-selectors";

import styles from "../../Authentificate.module.css";

const LoginForm = ({ submitForm }) => {
  const { loading: authLoading } = useSelector(selectAuth);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const result = await submitForm(data);

    if (result.success) {
      reset();
    } else if (result.error) {
      const field = result.error.toLowerCase().includes("password")
        ? "password"
        : "identifier";
      setError(field, { type: "server", message: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formfields}>
        <TextField
          placeholder="Username or Email"
          type="text"
          {...register("identifier")}
        />
        {errors.identifier && (
          <p className={styles.errorMessage}>{errors.identifier.message}</p>
        )}

        <TextField
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <p className={styles.errorMessage}>{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        text="Log in"
        color="primary"
        loading={authLoading}
      />

      <div className={styles.separatorContainer}>
        <div className={styles.separator}></div>
        <span className={styles.orText}>OR</span>
        <div className={styles.separator}></div>
      </div>

      <Link className={styles.link} to="/forgot-password">
        Forgot password?
      </Link>
    </form>
  );
};

export default LoginForm;
