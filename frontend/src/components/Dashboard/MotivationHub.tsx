"use client";

import React, { useEffect } from "react";
import styles from "@/Styles/Dashboard/MotivationHub.module.css";
import { useReactor } from "@/Hooks/useReactor";
import { refreshMotivationIntent } from "@/core/intent/motivationIntents";
import { LuSparkles, LuRefreshCw } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

interface MotivationData {
  quote: string;
  author: string;
  lastUpdated: string | null;
}

const MotivationHub: React.FC = () => {
  const motivation = useReactor<MotivationData>("user.motivation");

  // Initial refresh logic (only if empty or new day)
  useEffect(() => {
    refreshMotivationIntent();
  }, []);

  const handleManualRefresh = () => {
    refreshMotivationIntent(true); // Force a new random tip
  };

  if (!motivation) return null; // Prevent crash if state is not yet ready

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
      className={styles.Motivation_Card}
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <div className={styles.Header}>
        <span className={styles.Title}>
          <LuSparkles /> Daily Spark
        </span>
        <button
          className={styles.Refresh_Button}
          onClick={handleManualRefresh}
          aria-label="New motivation"
          title="Refresh Spark"
        >
          <LuRefreshCw size={16} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={motivation.quote}
          className={styles.Content}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          <p className={styles.Quote_Text}>{motivation.quote}</p>
          <span className={styles.Quote_Author}>{motivation.author}</span>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
};

export default MotivationHub;
