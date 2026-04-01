"use client";

import React from "react";
import styles from "@/Styles/Dashboard/ActiveHabits.module.css";
import { useReactor } from "@/Hooks/useReactor";
import { Habit } from "@/core/types/habit";
import TrackerCard from "../Tracker/TrackerCard";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "../UI/Button";
import { LuArrowRight } from "react-icons/lu";
import dayjs from "dayjs";

const ActiveHabits: React.FC = () => {
  const habits = useReactor<Habit[]>("habits") || [];

  const today = dayjs().format("YYYY-MM-DD");

  // Sort: Uncompleted first, then by highest streak, then by most recently started
  const topHabits = [...habits]
    .sort((a, b) => {
      const aDone = a.history.includes(today);
      const bDone = b.history.includes(today);

      if (aDone !== bDone) return aDone ? 1 : -1; // Done habits go last
      if (b.streak !== a.streak) return b.streak - a.streak;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    })
    .slice(0, 6);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      className={styles.Habits_Section}
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <div className={styles.Section_Header}>
        <h2 className={styles.Section_Title}>Your Top Sparks</h2>
        <div className={styles.Header_Actions}>
          {habits.length > 6 && (
            <Link href="/tracker">
              <Button
                variant="secondary"
                style={{
                  padding: "0 var(--spacing-md)",
                  height: "32px",
                  fontSize: "0.75rem",
                }}
              >
                View All{" "}
                <LuArrowRight size={14} style={{ marginLeft: "4px" }} />
              </Button>
            </Link>
          )}
          <Link className={styles.Button_Link} href="/suggestion">
            <Button
              style={{
                padding: "var(--spacing-sm) var(--spacing-lg)",
                fontSize: "0.8rem",
              }}
            >
              + New Habit
            </Button>
          </Link>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className={styles.Habits_Empty}>
          <div className={styles.Empty_Icon}>🌱</div>
          <p className={styles.Empty_Text}>
            Every great journey starts with a single spark. Ready to ignite
            yours?
          </p>
          <Link href="/suggestion">
            <Button showIcon>Browse Suggestions</Button>
          </Link>
        </div>
      ) : (
        <TrackerCard habits={topHabits} />
      )}
    </motion.div>
  );
};

export default ActiveHabits;
