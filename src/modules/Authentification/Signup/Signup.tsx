import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../redux/store";
import { selectAuth } from "../../../redux/auth/auth-selectors";
import { signup } from "../../../redux/auth/auth-thunks";

import SignupForm from "./SignupForm/SignupForm";
import type { TypeOf } from "zod";
import signupSchema from "./SignupForm/signupSchema";

import styles from "../Authentificate.module.css";

type SignupFormInputs = TypeOf<typeof signupSchema>;

const Signup: React.FC = () => {
  const { loading } = useSelector((state: RootState) => selectAuth(state));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const submitForm = async (payload: SignupFormInputs) => {
    const result = await dispatch(signup(payload));

    if (signup.fulfilled.match(result)) {
      navigate("/verify");
      return { success: true };
    }

    if (signup.rejected.match(result)) {
      return {
        success: false,
        error: result.payload || "Something went wrong",
      };
    }

    return { success: false, error: "Unknown error" };
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.card}>
          <img src="/logo.svg" alt="ICHGRAM logo" className={styles.logo} />
          <p className={styles.subtitle}>
            Sign up to see photos and videos from your friends.
          </p>
          <SignupForm submitForm={submitForm} loading={loading} />
        </div>

        <div className={styles.signupCard}>
          <p>
            Have an account?{" "}
            <Link to="/" className={styles.signupText}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
