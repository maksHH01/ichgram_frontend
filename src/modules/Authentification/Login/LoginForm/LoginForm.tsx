import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

import TextField from "../../../../shared/components/TextField/TextField";
import Button from "../../../../shared/components/Button/Button";
import loginSchema from "./loginSchema";

import type { z } from "zod";
import styles from "../../Authentificate.module.css";

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginFormProps {
  submitForm: (
    data: LoginFormInputs
  ) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ submitForm, loading }) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitted },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginFormInputs) => {
    const result = await submitForm(data);

    if (result.success) {
      reset();
    } else {
      setError("root", {
        type: "server",
        message: "Invalid login or password",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formfields}>
        <TextField
          placeholder="Username or Email"
          type="text"
          {...register("identifier", {
            onChange: () => clearErrors(),
          })}
        />
        {isSubmitted && errors.identifier && (
          <p className={styles.errorMessage}>{errors.identifier.message}</p>
        )}

        <TextField
          placeholder="Password"
          type="password"
          {...register("password", {
            onChange: () => clearErrors(),
          })}
        />
        {isSubmitted && errors.password && (
          <p className={styles.errorMessage}>{errors.password.message}</p>
        )}
      </div>

      {errors.root && (
        <p className={styles.errorMessage}>{errors.root.message}</p>
      )}

      <Button type="submit" text="Log in" color="primary" loading={loading} />

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
