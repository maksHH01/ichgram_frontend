import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TextField from "../../../../layouts/TextField/TextField";
import Button from "../../../../layouts/Button/Button";

import loginSchema from "./loginSchema"; // Zod-схема
import { selectAuth } from "../../../../redux/auth/auth-selectors";

import useFieldValidation from "../../../../shared/hooks/useFieldValidation";

import styles from "../../Authentificate.module.css";

// Тип автоматически выводится из Zod-схемы
type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginFormProps {
  submitForm: (
    data: LoginFormInputs
  ) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ submitForm }) => {
  const { loading: authLoading } = useSelector(selectAuth);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema), // заменили yupResolver на zodResolver
    mode: "onChange",
  });

  useFieldValidation({ control, setError: () => {}, clearErrors: () => {} });

  const [serverError, setServerError] = useState<{
    field: keyof LoginFormInputs;
    message: string;
  } | null>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    setServerError(null);
    const result = await submitForm(data);

    if (result.success) {
      reset();
    } else if (result.error) {
      const field: keyof LoginFormInputs = result.error
        .toLowerCase()
        .includes("password")
        ? "password"
        : "identifier";

      setServerError({ field, message: result.error });
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
          <p className="errorMessage">{errors.identifier.message}</p>
        )}
        {serverError?.field === "identifier" && (
          <p className="errorMessage">{serverError.message}</p>
        )}

        <TextField
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="errorMessage">{errors.password.message}</p>
        )}
        {serverError?.field === "password" && (
          <p className="errorMessage">{serverError.message}</p>
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
