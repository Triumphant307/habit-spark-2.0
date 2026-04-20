"use client";

import React from "react";
import styles from "@/Styles/Dashboard/StatsOverview.module.css";
import { useReactor } from "sia-reactor/adapters/react";
import { appState } from "@/core/state/app";
import { LuFlame, LuZap, LuTrophy } from "react-icons/lu";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const StatsOverview: React.FC = () => {
  const s = useReactor(appState);
  const today = dayjs().format("YYYY-MM-DD");

  // 1. Calculate Best Streak
  const bestStreak = s.habits?.length > 0 ? Math.max(...s.habits.map((h) => h.streak)) : 0;

  // 2. Calculate Total Spark Points (Total completions ever)
  const totalSparkPoints = s.habits.reduce((acc, h) => acc + h.history.length, 0);

  // 3. Calculate Today's Progress
  const completedToday = s.habits.filter((h) => h.history.includes(today)).length;
  const progressPercent = s.habits?.length > 0 ? Math.round((completedToday / s.habits.length) * 100) : 0;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div className={styles.Stats_Grid} initial="hidden" animate="visible" variants={itemVariants}>
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
        {completedToday} / {s.habits.length} finished
      </div>
    </motion.div>
  );
};

export default StatsOverview;
