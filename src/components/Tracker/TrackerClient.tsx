"use client";

import styles from "@/Styles/Tracker/Tracker.module.css";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import TrackerCard from "./TrackerCard";
import Search from "@/components/Suggestion/Search";
import { useState, useRef } from "react";
import { useReactor } from "sia-reactor/adapters/react";
import { appState } from "@/core/state/app";
import { GOAL_OPTIONS } from "@/types/onboarding";

const CATEGORIES = ["All", ...GOAL_OPTIONS.map((opt) => opt.value)];

export default function TrackerClient() {
  const s = useReactor(appState);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const resultRef = useRef<HTMLDivElement | null>(null);

  // Advanced Filtering: Category + Search
  const filteredHabits = s.habits.filter((habit) => {
    const matchesSearch = habit.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || habit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  };

  return (
    <motion.section
      className={styles.Tracker}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Premium Header */}
      <motion.header className={styles.Tracker_Header} variants={itemVariants}>
        <h1 className={styles.Tracker_Title}>Your Sparks</h1>
        <p className={styles.Tracker_Subtitle}>
          You are currently tracking <strong>{s.habits.length}</strong> habit
          {s.habits.length !== 1 ? "s" : ""}.
        </p>
      </motion.header>

      {/* 2. Tools: Search & Filter Bar */}
      <motion.div className={styles.Tracker_Tools} variants={itemVariants}>
        <div style={{ marginBottom: "var(--spacing-md)" }}>
          <Search
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            resultRef={resultRef}
          />
        </div>

        <div className={styles.Filter_Bar}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.Filter_Pill} ${
                selectedCategory === cat ? styles.Active : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 3. Habit List / Empty State */}
      <AnimatePresence mode="wait">
        {filteredHabits.length === 0 ? (
          <motion.div
            key="empty-state"
            className={styles.Tracker_NoResults}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            variants={itemVariants}
          >
            <span style={{ fontSize: "3rem" }}>
              {searchQuery ? "🔍" : "🌱"}
            </span>
            <p className={styles.Empty_Text}>
              {searchQuery
                ? `No sparks found in "${selectedCategory}" matching "${searchQuery}"`
                : `No habits found in the "${selectedCategory}" category.`}
            </p>
            <div style={{ marginTop: "10px" }}>
              {searchQuery || selectedCategory !== "All" ? (
                <button
                  className={styles.Tracker_SuggestButton}
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  style={{ border: "none", cursor: "pointer" }}
                >
                  Reset Filters
                </button>
              ) : (
                <Link
                  href="/suggestion"
                  className={styles.Tracker_SuggestButton}
                >
                  Explore Suggestions
                </Link>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="habit-list" variants={itemVariants}>
            <TrackerCard habits={filteredHabits} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
