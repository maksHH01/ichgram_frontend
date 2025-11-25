import styles from "../Authentificate.module.css";
import lockLogo from "../../../assets/svg/lockIcon.svg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Button from "../../../shared/components/Button/Button";
import TextField from "../../../shared/components/TextField/TextField";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    if (!data.identifier) {
      setError("identifier", { type: "manual", message: "Field is required" });
      return;
    }

    navigate("/forgot-password/complete");
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSectionForgotPass}>
        <div className={styles.cardForgotPass}>
          <img src={lockLogo} alt="lock logo" />
          <p className={styles.subtitleBlack}>Trouble logging in?</p>
          <p className={styles.subtitleForgotPass}>
            Enter your email, phone, or username and we'll send you a link to
            get back into your account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <TextField
              placeholder="Email or Username"
              {...register("identifier", { required: "Field is required" })}
            />
            {errors.identifier && (
              <p className={styles.errorMessage}>{errors.identifier.message}</p>
            )}

            <Button type="submit" text="Reset your password" />
          </form>

          <div className={styles.separatorContainerForgotPass}>
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
