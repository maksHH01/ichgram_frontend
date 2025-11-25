import styles from "./TermsOfService.module.css";

import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageSection}>
        <div className={styles.card}>
          <h1 className={styles.pageTitle}>Terms of Service</h1>

          <p className={styles.pageText}>
            By using our service, you agree to comply with the following terms.
          </p>

          <ul className={styles.pageList}>
            <li className={styles.pageListItem}>
              You must be at least 13 years old to use the service.
            </li>
            <li className={styles.pageListItem}>
              Respect other users and do not post harmful content.
            </li>
            <li className={styles.pageListItem}>
              We reserve the right to terminate accounts violating these terms.
            </li>
          </ul>

          <p className={styles.pageText}>
            Learn more about our{" "}
            <a href="/privacy-policy" className={styles.pageLink}>
              Privacy Policy
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

export default TermsOfService;
