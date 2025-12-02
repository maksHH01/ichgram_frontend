import styles from "./LoginPage.module.css";
import Login from "../../../modules/Authentification/Login/Login";

import EditProfile from "../../../modules/Profile/EditProfile/EditProfile";

const LoginPage = () => {
  return (
    <>
      <Login />
      <EditProfile />
    </>
  );
};

export default LoginPage;
