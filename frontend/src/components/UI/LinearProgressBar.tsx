"use client";

import React from "react";
import styles from "@/Styles/UI/LinearProgressBar.module.css";
import { motion } from "framer-motion";

interface LinearProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
}

const LinearProgressBar: React.FC<LinearProgressBarProps> = ({
  progress,
  className,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`${styles.ProgressBar_Track} ${className || ""}`}>
      <motion.div
        className={styles.ProgressBar_Fill}
        initial={{ width: 0 }}
        animate={{ width: `${clampedProgress}%` }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 15,
          restDelta: 0.001,
        }}
      >
        {clampedProgress > 0 && clampedProgress < 100 && (
          <div className={styles.ProgressBar_Spark} />
        )}
      </motion.div>
    </div>
  );
};

export default LinearProgressBar;
