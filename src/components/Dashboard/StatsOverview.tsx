"use client";

import React from "react";
import styles from "@/Styles/Dashboard/StatsOverview.module.css";
import { useReactor } from "@/Hooks/useReactor";
import { Habit } from "@/core/types/habit";
import { LuFlame, LuZap, LuTrophy } from "react-icons/lu";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const StatsOverview: React.FC = () => {
  const habits = useReactor<Habit[]>("habits") || [];
  const today = dayjs().format("YYYY-MM-DD");

  // 1. Calculate Best Streak
  const bestStreak =
    habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;

  // 2. Calculate Total Spark Points (Total completions ever)
  const totalSparkPoints = habits.reduce((acc, h) => acc + h.history.length, 0);

  // 3. Calculate Today's Progress
  const completedToday = habits.filter((h) => h.history.includes(today)).length;
  const progressPercent =
    habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      className={styles.Stats_Grid}
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <div className={styles.Stat_Card}>
        <div className={styles.Stat_Header}>
          <span className={styles.Stat_Label}>Best Streak</span>
          <LuFlame className={styles.Stat_Icon} />
        </div>
        <span className={styles.Stat_Value}>{bestStreak} days</span>
        <span className={styles.Stat_Subtext}>Keep the momentum!</span>
      </div>

      <div className={styles.Stat_Card}>
        <div className={styles.Stat_Header}>
          <span className={styles.Stat_Label}>Spark Points</span>
          <LuZap className={styles.Stat_Icon} />
        </div>
        <span className={styles.Stat_Value}>{totalSparkPoints}</span>
        <span className={styles.Stat_Subtext}>Total lifetime sparks</span>
      </div>

      <div className={styles.Stat_Card}>
        <div className={styles.Stat_Header}>
          <span className={styles.Stat_Label}>Today's Goal</span>
          <LuTrophy className={styles.Stat_Icon} />
        </div>
        <span className={styles.Stat_Value}>{progressPercent}%</span>
        <span className={styles.Stat_Subtext}>
          {completedToday} / {habits.length} finished
        </span>
      </div>
    </motion.div>
  );
};

export default StatsOverview;
