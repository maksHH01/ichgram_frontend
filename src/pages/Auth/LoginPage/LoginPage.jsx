import styles from "./LoginPage.module.css";

import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <>
      <h1>Login page</h1>
      <Link to="/signup">Регистрация</Link>
    </>
  );
};

export default LoginPage;
