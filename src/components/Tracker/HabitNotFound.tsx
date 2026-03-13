import React from "react";
import Link from "next/link";
import styles from "@/app/Styles/Tracker/HabitNotFound.module.css";
import { Planet } from "react-kawaii";

const HabitNotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <Planet size={200} mood="ko" color="#FCCB7E" />
      <h1 className={styles.title}>Habit Not Found</h1>
      <p className={styles.message}>
        Oops! We couldn't find the habit you're looking for. It might have been
        deleted or you may have followed a broken link.
      </p>
      <Link href="/tracker">
        <button className={styles.button}>Go Back to Tracker</button>
      </Link>
    </div>
  );
};

export default HabitNotFound;
