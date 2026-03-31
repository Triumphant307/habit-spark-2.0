"use client";

import React, { useState, useRef } from "react";
import styles from "@/Styles/Dashboard/ActiveHabits.module.css";
import { useReactor } from "@/Hooks/useReactor";
import { Habit } from "@/core/types/habit";
import Search from "@/components/Suggestion/Search";
import TrackerCard from "../Tracker/TrackerCard";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "../UI/Button";

const ActiveHabits: React.FC = () => {
  const habits = useReactor<Habit[]>("habits") || [];
  const [searchQuery, setSearchQuery] = useState("");
  const resultRef = useRef<HTMLDivElement | null>(null);

  const filteredHabits = habits.filter((habit) =>
    habit.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
      className={styles.Habits_Section}
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <div className={styles.Section_Header}>
        <h2 className={styles.Section_Title}>Your Active Sparks</h2>
        {habits.length > 0 && (
          <Link href="/suggestion">
            <Button
              style={{
                padding: "var(--spacing-sm) var(--spacing-lg)",
                fontSize: "0.8rem",
              }}
            >
              + New Habit
            </Button>
          </Link>
        )}
      </div>

      <div style={{ marginBottom: "var(--spacing-xl)" }}>
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          resultRef={resultRef}
        />
      </div>

      {filteredHabits.length === 0 ? (
        <div className={styles.Habits_Empty}>
          <div className={styles.Empty_Icon}>{searchQuery ? "🔍" : "🌱"}</div>
          <p className={styles.Empty_Text}>
            {searchQuery
              ? `No habits matching "${searchQuery}"`
              : "Every great journey starts with a single spark. Ready to ignite yours?"}
          </p>
          <Link href="/suggestion">
            <Button showIcon>
              {searchQuery ? "Clear Search" : "Browse Suggestions"}
            </Button>
          </Link>
        </div>
      ) : (
        <TrackerCard habits={filteredHabits} />
      )}
    </motion.div>
  );
};

export default ActiveHabits;
