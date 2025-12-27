"use client";
import styles from "../Styles/Completed.module.css";
const Completed = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <span className={styles.icon}>🚧</span>

        <h1 className={styles.title}>Under Development</h1>

        <p className={styles.description}>
          This Page is currently being worked on.
          <br />
          Please check back soon — we’re building something great.
        </p>
      </div>
    </div>
  );
};

export default Completed;
