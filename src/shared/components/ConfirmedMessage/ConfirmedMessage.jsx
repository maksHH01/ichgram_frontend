import React from "react";
import styles from "./ConfirmedMessage.module.css";
import { Link } from "react-router-dom";

import confirmLogo from "../../../assets/images/illo-confirm-refresh-light.png.png";

const ConfirmedMessage = ({ imageSrc = confirmLogo, title, message }) => {
  return (
    <div className={styles.wrapper}>
      <img src={imageSrc} alt="Confirmation illustration" />
      <h1>{title}</h1>
      <p className={styles.confirmText}>{message}</p>
      <Link to="/" className={styles.backLink}>
        Back to login
      </Link>
    </div>
  );
};

export default ConfirmedMessage;
