"use client";

import React from "react";
import styles from "@/Styles/Dashboard/DashboardComponents.module.css";
import { useReactor } from "@/Hooks/useReactor";
import { Habit } from "@/core/types/habit";
import { LuFlame, LuZap, LuTrophy } from "react-icons/lu";
import dayjs from "dayjs";

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

  return (
    <div className={styles.Stats_Grid}>
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
    </div>
  );
};

export default StatsOverview;
