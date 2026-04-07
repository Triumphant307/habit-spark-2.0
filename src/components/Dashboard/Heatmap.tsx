"use client";

import React, { useMemo } from "react";
import styles from "@/Styles/Dashboard/Heatmap.module.css";
import { useReactor } from "@/Hooks/useReactor";
import { Habit } from "@/core/types/habit";
import { getHeatmapData } from "@/utils/dateUtils";
import { motion } from "framer-motion";
import dayjs from "dayjs";

const Heatmap: React.FC = () => {
  const habits = useReactor<Habit[]>("habits") || [];

  // 1. Memoize the calculation for performance
  const data = useMemo(() => getHeatmapData(habits), [habits]);

  // 2. Map completion count to a visual level (0 to 4)
  const getLevel = (count: number) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.005 },
    },
  };

  const cellVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <section className={styles.Heatmap_Container}>
      <div className={styles.Header}>
        <h2 className={styles.Title}>Consistency Heatmap</h2>
        <div className={styles.Legend}>
          <span>Less</span>
          <div className={`${styles.Cell} ${styles.Level_0}`} />
          <div className={`${styles.Cell} ${styles.Level_1}`} />
          <div className={`${styles.Cell} ${styles.Level_2}`} />
          <div className={`${styles.Cell} ${styles.Level_3}`} />
          <div className={`${styles.Cell} ${styles.Level_4}`} />
          <span>More</span>
        </div>
      </div>

      <div className={styles.Grid_Wrapper}>
        <motion.div
          className={styles.Grid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {data.map((day) => {
            const level = getLevel(day.count);
            return (
              <motion.div
                key={day.date}
                className={`${styles.Cell} ${styles[`Level_${level}`]}`}
                variants={cellVariants}
              >
                <div className={styles.Tooltip}>
                  <strong>{day.count} sparks</strong> on{" "}
                  {dayjs(day.date).format("MMM D")}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Heatmap;
