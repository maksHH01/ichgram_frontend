import styles from "./SignUpPage.module.css";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  return (
    <>
      <h1>SignUp page</h1>
      <Link to="/" className={styles.link}>
        Войти
      </Link>
    </>
  );
};

export default SignUpPage;
