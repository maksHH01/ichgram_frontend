import React, { useState } from "react";
import styles from "../Authentificate.module.css";
import previewImage from "../../../assets/images/preview-image.png";
import logo from "../../../assets/svg/main-logo.svg";

import LoginForm from "./LoginForm/LoginForm";
import { Link } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const submitForm = async (data) => {
    setLoading(true);
    console.log("Form data:", data);
    setLoading(false);

    return { success: true };
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <img
          src={previewImage}
          alt="app preview"
          className={styles.previewImage}
        />
      </div>

      <div className={styles.formSection}>
        <div className={styles.card}>
          <img src={logo} alt="ICHGRAM logo" className={styles.logo} />
          <LoginForm submitForm={submitForm} />
        </div>

        <div className={styles.signupCard}>
          <p>
            Don’t have an account?{" "}
            <Link href="/signup" className={styles.signupText}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
