import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

import TextField from "../../../../shared/components/TextField/TextField";
import Button from "../../../../shared/components/Button/Button";

import signupSchema from "./signupSchema";
import { selectAuth } from "../../../../redux/auth/auth-selectors";

import useFieldValidation from "../../../../shared/hooks/useFieldValidation";

import styles from "../../Authentificate.module.css";

const SignupForm = ({ submitForm, loading }) => {
  const { loading: authLoading } = useSelector(selectAuth);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  useFieldValidation({ control, setError, clearErrors });

  const onSubmit = async (data) => {
    const result = await submitForm(data);

    if (result.success) {
      reset();
    } else if (result.error) {
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
        <TextField placeholder="Email" {...register("email")} />
        {errors.email && <p className="errorMessage">{errors.email.message}</p>}

        <TextField placeholder="Full Name" {...register("fullname")} />
        {errors.fullname && (
          <p className="errorMessage">{errors.fullname.message}</p>
        )}

        <TextField placeholder="Username" {...register("username")} />
        {errors.username && (
          <p className="errorMessage">{errors.username.message}</p>
        )}

        <TextField
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="errorMessage">{errors.password.message}</p>
        )}
      </div>

      <div className={styles.termsBox}>
        <p className={styles.policyText}>
          People who use our service may have uploaded your contact information
          to Instagram.{" "}
          <Link to="/privacy-policy" className={styles.link}>
            Learn More
          </Link>
        </p>

        <p className={styles.policyText}>
          By signing up, you agree to our{" "}
          <Link to="/terms" className={styles.link}>
            Terms
          </Link>
          ,{" "}
          <Link to="/privacy-policy" className={styles.link}>
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link to="/cookies-policy" className={styles.link}>
            Cookies Policy
          </Link>
          .
        </p>
      </div>

      <Button
        type="submit"
        text="Sign up"
        color="primary"
        loading={authLoading}
      />
    </form>
  );
};

export default SignupForm;
