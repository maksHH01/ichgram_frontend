import React, { useState } from "react";
import { useForm } from "react-hook-form";

import TextField from "../../../../shared/components/TextField/TextField";
import Button from "../../../../shared/components/Button/Button";

import { Link } from "react-router-dom";

import styles from "../../Authentificate.module.css";

const SignUpForm = ({ submitForm }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await submitForm(data);
    setLoading(false);

    if (result.success) {
      reset();
      return;
    }

    if (result.error) {
      const msg = result.error.toLowerCase();
      if (msg.includes("email")) {
        setError("email", { type: "server", message: result.error });
      } else if (msg.includes("username")) {
        setError("username", { type: "server", message: result.error });
      } else {
        setError("password", { type: "server", message: result.error });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formfields}>
        <TextField
          placeholder="Email"
          type="email"
          {...register("email", {
            required: "Enter your email",
            pattern: {
              value: /^[\w.-]+@[\w.-]+\.\w+$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <p className={styles.errorMessage}>{errors.email.message}</p>
        )}

        <TextField
          placeholder="Fullname"
          {...register("fullname", {
            required: "Enter your name",
            minLength: { value: 2, message: "Minimum 2 characters" },
            maxLength: { value: 20, message: "Maximum 20 characters" },
          })}
        />
        {errors.fullname && (
          <p className={styles.errorMessage}>{errors.fullname.message}</p>
        )}

        <TextField
          placeholder="Username"
          {...register("username", {
            required: "Enter your username",
            minLength: { value: 3, message: "Minimum 3 characters" },
            maxLength: { value: 20, message: "Maximum 20 characters" },
          })}
        />
        {errors.username && (
          <p className={styles.errorMessage}>{errors.username.message}</p>
        )}

        <TextField
          placeholder="Password"
          type="password"
          {...register("password", {
            required: "Enter your password",
            minLength: { value: 6, message: "Must be at least 6 characters" },
          })}
        />
        {errors.password && (
          <p className={styles.errorMessage}>{errors.password.message}</p>
        )}
      </div>

      <div className={styles.termsBox}>
        <p className={styles.policyText}>
          People who use our service may have uploaded your contact information
          to Instagram.{" "}
          <Link to="/privacy-policy" target="_blank" className={styles.link}>
            Learn More
          </Link>
        </p>

        <p className={styles.policyText}>
          By signing up, you agree to our{" "}
          <Link to="/terms" target="_blank" className={styles.link}>
            Terms
          </Link>{" "}
          ,{" "}
          <Link to="/privacy-policy" target="_blank" className={styles.link}>
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link to="/cookies-policy" target="_blank" className={styles.link}>
            Cookies Policy
          </Link>{" "}
          .
        </p>
      </div>

      <Button type="submit" text="Sign up" color="primary" loading={loading} />
    </form>
  );
};

export default SignUpForm;
