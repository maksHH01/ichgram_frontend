import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { resetPasswordApi } from "../../shared/api/register-api";
import axios from "axios";

import styles from "./ResetPasswordPage.module.css";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const verificationCode = searchParams.get("verificationCode");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!verificationCode) {
      setError("Invalid or missing verification code");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPasswordApi(verificationCode, newPassword);
      setMessage("Password successfully reset. Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h2 className={styles.title}>Reset Password</h2>

        {message && (
          <p className={`${styles.message} ${styles.success}`}>{message}</p>
        )}
        {error && (
          <p className={`${styles.message} ${styles.error}`}>{error}</p>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className={styles.button} type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
