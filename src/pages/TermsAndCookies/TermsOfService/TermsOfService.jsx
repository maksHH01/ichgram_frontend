import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TermsOfService.module.css";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        &larr; Go Back
      </button>

      <h1 className={styles.title}>Terms of Service</h1>
      <p className={styles.lastUpdated}>Last updated: December 2025</p>

      <section className={styles.section}>
        <h2 className={styles.heading}>1. Acceptance of Terms</h2>
        <p className={styles.text}>
          By accessing or using ICHgram ("Service"), you agree to be bound by
          these Terms. If you do not agree to these terms, please do not access
          or use the Service.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>2. Who Can Use the Service</h2>
        <p className={styles.text}>
          You may use the Service only if you can form a binding contract with
          ICHgram, and only in compliance with these Terms and all applicable
          local, state, national, and international laws, rules, and
          regulations.
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            You must be at least 13 years old.
          </li>
          <li className={styles.listItem}>
            You must not be prohibited from receiving any aspect of our Service
            under applicable laws.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>3. Your Content & Permissions</h2>
        <p className={styles.text}>
          You retain full ownership of the photos, text, and other content
          ("User Content") that you post on ICHgram. However, you grant us a
          non-exclusive, royalty-free, transferable, sub-licensable, worldwide
          license to use, store, display, reproduce, save, modify, create
          derivative works, perform, and distribute your User Content on ICHgram
          for the purposes of operating, developing, providing, and using the
          Service.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>4. Prohibited Conduct</h2>
        <p className={styles.text}>
          You agree not to engage in any of the following prohibited activities:
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            Posting content that is illegal, harmful, threatening, abusive,
            harassing, defamatory, or hateful.
          </li>
          <li className={styles.listItem}>
            Impersonating others or providing false information.
          </li>
          <li className={styles.listItem}>
            Spamming or soliciting other users for commercial purposes.
          </li>
        </ul>
      </section>
    </main>
  );
};

export default TermsOfService;
