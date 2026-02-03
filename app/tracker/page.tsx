"use client";
import styles from "@/app/Styles/Tracker/Tracker.module.css";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import TrackerCard from "../components/Tracker/TrackerCard";
import Search from "@/app/components/suggestion/Search";
import { useState, useRef, useEffect } from "react";
import { useReactor } from "../Hooks/useReactor";

const Tracker = () => {
  const habits = useReactor<any[]>("habits") || [];
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredHabits = habits.filter((habit) =>
    habit.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const resultRef = useRef(null);

  if (!isMounted) {
    return (
      <section className={styles.tracker}>
        <div className="tracker-page">
          <h2 className={styles.title}>🎯 Your Habits</h2>
        </div>
        {/* Render a skeleton or empty state that matches server output to avoid layout shift if possible, 
            but for now, returning the basic structure is safer than a mismatch. */}
      </section>
    );
  }

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
          <span style={{ fontSize: "2rem" }}>📭</span>
          <p>
            {searchQuery
              ? "No habits match your search."
              : "No habits added yet."}
          </p>
          <small>
            {searchQuery
              ? "Try a different keyword."
              : "Browse suggestions to start tracking habits."}
          </small>
          <br />
          <div>
            {searchQuery ? (
              ""
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
};

export default Tracker;
