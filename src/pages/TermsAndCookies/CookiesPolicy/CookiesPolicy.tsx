import { useNavigate } from "react-router-dom";
import styles from "../TermsOfService/TermsOfService.module.css";

const CookiesPolicy = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        &larr; Go Back
      </button>

      <h1 className={styles.title}>Cookies Policy</h1>
      <p className={styles.lastUpdated}>Last updated: December 2025</p>

      <section className={styles.section}>
        <h2 className={styles.heading}>1. What Are Cookies?</h2>
        <p className={styles.text}>
          Cookies are small text files that are stored on your computer or
          mobile device when you visit a website. They are widely used to make
          websites work more efficiently and to provide information to the
          owners of the site.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>2. How We Use Cookies</h2>
        <p className={styles.text}>
          We use cookies for several purposes, including:
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <strong>Essential Cookies:</strong> These are necessary for the
            Service to function properly (e.g., keeping you logged in).
          </li>
          <li className={styles.listItem}>
            <strong>Functionality Cookies:</strong> These allow us to remember
            choices you make.
          </li>
          <li className={styles.listItem}>
            <strong>Analytics Cookies:</strong> These help us understand how
            users interact with our Service.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>3. Managing Cookies</h2>
        <p className={styles.text}>
          Most web browsers automatically accept cookies, but you can usually
          modify your browser settings to decline cookies if you prefer.
        </p>
      </section>
    </main>
  );
};

export default CookiesPolicy;
