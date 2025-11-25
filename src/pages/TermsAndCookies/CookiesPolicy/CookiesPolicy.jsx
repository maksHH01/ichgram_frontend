import styles from "./CookiesPolicy.module.css";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const CookiesPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageSection}>
        <div className={styles.card}>
          <h1 className={styles.pageTitle}>Cookies Policy</h1>

          <p className={styles.pageText}>
            We use cookies to improve your experience on our website.
          </p>

          <ul className={styles.pageList}>
            <li className={styles.pageListItem}>
              Cookies help us remember your login and preferences.
            </li>
            <li className={styles.pageListItem}>
              You can control cookies in your browser settings.
            </li>
          </ul>

          <p className={styles.pageText}>
            Read our{" "}
            <Link to="/privacy-policy" className={styles.pageLink}>
              Privacy Policy
            </Link>{" "}
            for more details.
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

export default CookiesPolicy;
