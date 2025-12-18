import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

import { selectAuth } from "../../../redux/auth/auth-selectors";
import { login } from "../../../redux/auth/auth-thunks";

import { verifyUserApi } from "../../../shared/api/register-api";
import LoginForm from "./LoginForm/LoginForm";
import type { AppDispatch, RootState } from "../../../redux/store";
import type { TypeOf } from "zod";
import loginSchema from "./LoginForm/loginSchema";

import styles from "../Authentificate.module.css";

type LoginFormInputs = TypeOf<typeof loginSchema>;

const Login: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const verificationCode = searchParams.get("verificationCode");

  const [successVerify, setSuccessVerify] = useState(false);

  const authState = useSelector((state: RootState) => selectAuth(state));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (verificationCode) {
      const fetchVerify = async () => {
        try {
          await verifyUserApi(verificationCode);
          setSuccessVerify(true);
          setSearchParams({});
        } catch (error) {
          console.error("Verification failed", error);
        }
      };
      fetchVerify();
    }
  }, [verificationCode, setSearchParams]);

  const submitForm = async (payload: LoginFormInputs) => {
    const result = await dispatch(login(payload));

    if (login.fulfilled.match(result)) {
      navigate("/dashboard");
      return { success: true };
    }

    if (login.rejected.match(result)) {
      return {
        success: false,
        error: result.payload || "Invalid credentials",
      };
    }

    return { success: false, error: "Unknown error" };
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <img
          src="/login-image.png"
          alt="App preview"
          className={styles.previewImage}
        />
      </div>

      <div className={styles.formSection}>
        <div className={styles.card}>
          <img src="/logo.svg" alt="ICHGRAM logo" className={styles.logo} />
          {successVerify && (
            <p className={styles.subtitleBlack}>Email successfully verified</p>
          )}
          <LoginForm submitForm={submitForm} loading={authState.loading} />
        </div>

        <div className={styles.signupCard}>
          <p>
            Don’t have an account?{" "}
            <Link to="/signup" className={styles.signupText}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
