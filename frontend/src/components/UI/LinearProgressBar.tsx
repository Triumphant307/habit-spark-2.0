"use client";

import React from "react";
import styles from "@/Styles/UI/LinearProgressBar.module.css";

interface LinearProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
}

const LinearProgressBar: React.FC<LinearProgressBarProps> = ({
  progress,
  className,
}) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`${styles.ProgressBar_Track} ${className || ""}`}>
      <div
        className={styles.ProgressBar_Fill}
        style={{ width: `${clampedProgress}%` }}
      >
        {clampedProgress > 0 && clampedProgress < 100 && (
          <div className={styles.ProgressBar_Spark} />
        )}
      </div>
    </div>
  );
};

export default LinearProgressBar;
