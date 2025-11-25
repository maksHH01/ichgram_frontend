import styles from "./PrivacyPolicy.module.css";

import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageSection}>
        <div className={styles.card}>
          <h1 className={styles.pageTitle}>Privacy Policy</h1>

          <p className={styles.pageText}>
            We value your privacy. This policy explains how we collect and use
            your data.
          </p>

          <ul className={styles.pageList}>
            <li className={styles.pageListItem}>
              We may collect personal information such as email and username.
            </li>
            <li className={styles.pageListItem}>
              Your data is used to improve our service.
            </li>
          </ul>

          <p className={styles.pageText}>
            For more details, see our{" "}
            <a href="/terms" className={styles.pageLink}>
              Terms of Service
            </a>
            .
          </p>

          <button
            className={styles.pageButton}
            onClick={() => navigate("/signup")}
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
