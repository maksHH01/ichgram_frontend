import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../TermsOfService/TermsOfService.module.css";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        &larr; Go Back
      </button>

      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.lastUpdated}>Last updated: December 2025</p>

      <section className={styles.section}>
        <h2 className={styles.heading}>1. Information We Collect</h2>
        <p className={styles.text}>
          We collect various types of information in connection with the
          services we provide, including:
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <strong>User-Provided Information:</strong> Personal data such as
            your username, email address, password, and profile photo when you
            register.
          </li>
          <li className={styles.listItem}>
            <strong>Content:</strong> Photos, comments, and other materials that
            you post to the Service.
          </li>
          <li className={styles.listItem}>
            <strong>Usage Data:</strong> Information about your activity on
            ICHgram, such as the posts you like, the users you follow, and the
            time and duration of your visits.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>2. How We Use Your Information</h2>
        <p className={styles.text}>We use the information we collect to:</p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            Provide, maintain, and improve the Service.
          </li>
          <li className={styles.listItem}>
            Personalize your experience and feed.
          </li>
          <li className={styles.listItem}>
            Communicate with you about products, services, offers, and events.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>3. Sharing of Information</h2>
        <p className={styles.text}>
          We do not sell your personal information to third parties. We may
          share your information with service providers who perform services on
          our behalf (e.g., hosting, analytics).
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
