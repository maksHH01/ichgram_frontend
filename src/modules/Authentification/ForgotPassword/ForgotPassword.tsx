import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { sendResetLinkApi } from "../../../shared/api/register-api";

import Button from "../../../shared/components/Button/Button";
import TextField from "../../../shared/components/TextField/TextField";

import styles from "../Authentificate.module.css";

interface ForgotPasswordForm {
  identifier: string;
}

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordForm>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    try {
      await sendResetLinkApi(data.identifier);
      navigate("/forgot-password/complete");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong";
      setError("identifier", { type: "manual", message });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSectionChangePass}>
        <div className={styles.card}>
          <img
            className={styles.logoChangePass}
            src="/forgot-password.svg"
            alt="changePass logo"
          />
          <p className={styles.subtitleBlack}>Trouble logging in?</p>
          <h5 className={styles.changePassInfo}>
            Enter your email, phone, or username and we'll send you a link to
            get back into your account.
          </h5>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.formForgotPass}
          >
            <TextField
              placeholder="Email or Username"
              {...register("identifier", { required: "Field is required" })}
            />
            {errors.identifier?.message && (
              <p className="errorMessage">{errors.identifier.message}</p>
            )}

            <Button
              className={styles.btn}
              type="submit"
              text="Reset your password"
            />
          </form>

          <div className={styles.separatorContainer}>
            <div className={styles.separator}></div>
            <span className={styles.orText}>OR</span>
            <div className={styles.separator}></div>
          </div>

          <div className={styles.linkWithoutBorder}>
            <Link to="/signup" className={styles.backToLoginLink}>
              Create new account
            </Link>
          </div>
        </div>
        <div className={styles.backToLogin}>
          <Link to="/" className={styles.backToLoginLink}>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
