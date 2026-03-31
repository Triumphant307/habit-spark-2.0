import React from "react";
import Link from "next/link";
import styles from "@/Styles/Tracker/HabitNotFound.module.css";
import { Planet } from "react-kawaii";

const HabitNotFound: React.FC = () => {
  return (
    <div className={styles.HabitNotFound_Container}>
      <Planet size={200} mood="ko" color="#FCCB7E" />
      <h1 className={styles.HabitNotFound_Title}>Habit Not Found</h1>
      <p className={styles.HabitNotFound_Message}>
        Oops! We couldn't find the habit you're looking for. It might have been
        deleted or you may have followed a broken link.
      </p>
      <Link href="/tracker">
        <button className={styles.HabitNotFound_Button}>
          Go Back to Tracker
        </button>
      </Link>
    </div>
  );
};

export default HabitNotFound;
