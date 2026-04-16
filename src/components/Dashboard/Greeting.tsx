"use client";

import React from "react";
import styles from "@/Styles/Dashboard/Greeting.module.css";
import layoutStyles from "@/Styles/Dashboard/Dashboard.module.css";
import dayjs from "dayjs";
import { useReactor } from "sia-reactor/adapters/react";
import { appState } from "@/core/state/app";
import { getTimeGreeting } from "@/utils/dateUtils";
import { motion } from "framer-motion";

const Greeting: React.FC = () => {
  const s = useReactor(appState);
  const timeGreeting = getTimeGreeting();

  const today = dayjs().format("YYYY-MM-DD");
  const remainingHabits = s.habits.filter(
    (h) => !h.history.includes(today),
  ).length;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  };

  return (
    <>
      {/* Personalized welcome greeting */}
      <div
        className={layoutStyles.Dashboard_Header}
        style={{ paddingTop: "var(--spacing-xl)" }}
      >
        <motion.div initial="hidden" animate="visible" variants={itemVariants}>
          <h1 className={styles.Greeting_Main}>
            {timeGreeting},{" "}
            <span className={styles.Greeting_Nickname}>{s.user.nickname}</span>!
          </h1>
          {s.habits.length > 0 ? (
            <div className={styles.Greeting_Summary}>
              {remainingHabits === 0
                ? "✨ All habits completed for today! You're on fire."
                : `🔥 You have ${remainingHabits} spark${remainingHabits > 1 ? "s" : ""} to ignite today.`}
            </div>
          ) : (
            <div className={styles.Greeting_Summary}>
              🌱 Ready to start your first habit?
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Greeting;
