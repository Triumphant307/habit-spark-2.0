"use client";
import styles from "@/app/Styles/Tracker/Tracker.module.css";
import { motion } from "framer-motion";
import Link from "next/link";
import TrackerCard from "./TrackerCard";
import Search from "@/app/components/suggestion/Search";
import { useState, useRef, useEffect } from "react";
import { useReactor } from "@/app/Hooks/useReactor";
import { notificationService } from "@/app/services/notificationService";
import dayjs from "dayjs";
import { Habit } from "@/core/types/habit";

export default function TrackerClient() {
  const habits = useReactor<Habit[]>("habits") || [];
  const [searchQuery, setSearchQuery] = useState("");

  // Streak-at-risk: notify once per session if it's evening and a habit isn't done
  useEffect(() => {
    if (!notificationService.isGranted()) return;
    const hour = new Date().getHours();
    const isEvening = hour >= 20; // after 8pm
    if (!isEvening) return;

    const today = dayjs().format("YYYY-MM-DD");
    habits.forEach((habit) => {
      const completedToday = habit.history.includes(today);
      if (!completedToday && habit.streak > 0) {
        notificationService.showStreakAtRisk(
          habit.title,
          habit.icon,
          habit.streak,
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount
  const resultRef = useRef<HTMLDivElement | null>(null);

  const filteredHabits = habits.filter((habit) =>
    habit.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <motion.section
      className={styles.tracker}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="tracker-page" variants={itemVariants}>
        <h2 className={styles.title}>🎯 Your Habits</h2>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          resultRef={resultRef}
        />
      </motion.div>

      {filteredHabits.length === 0 ? (
        <motion.div
          key="no-habits"
          className={styles.noResults}
          variants={itemVariants}
        >
          <span style={{ fontSize: "2rem" }}>{searchQuery ? "🔎" : "🌱"}</span>
          <p>
            {searchQuery
              ? `No habits matching "${searchQuery}"`
              : "Start your habit journey!"}
          </p>
          <small>
            {searchQuery
              ? "Try a shorter keyword or check the spelling"
              : "Add your first habit from our suggestions to begin tracking"}
          </small>
          <br />
          <div>
            {searchQuery ? (
              <button
                className={styles.goSuggestBtn}
                onClick={() => setSearchQuery("")}
                style={{ marginTop: "10px", border: "none" }}
              >
                Clear Search
              </button>
            ) : (
              <Link href="/suggestion" className={styles.goSuggestBtn}>
                Browse Suggestions
              </Link>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <TrackerCard habits={filteredHabits} />
        </motion.div>
      )}
    </motion.section>
  );
}
