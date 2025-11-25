import styles from "../Authentificate.module.css";

import mainLogo from "../../../assets/svg/main-logo.svg";
import SignUpForm from "./SignUpForm/SignUpForm";

import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.cardSignUp}>
          <img src={mainLogo} alt="ICHGRAM logo" className={styles.logo} />
          <p className={styles.subtitle}>
            Sign up to see photos and videos from your friends.
          </p>
          <SignUpForm />
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

export default SignUp;
