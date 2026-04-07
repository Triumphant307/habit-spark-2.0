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
  const data = useMemo(() => getHeatmapData(habits), [habits]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // 1. Group data into weeks (chunks of 7)
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < data.length; i += 7) {
      result.push(data.slice(i, i + 7));
    }
    return result;
  }, [data]);

  // 2. Identify month labels and their week index
  const monthLabels = useMemo(() => {
    const labels: { name: string; index: number }[] = [];
    weeks.forEach((week, i) => {
      const firstDay = dayjs(week[0].date);
      const monthName = firstDay.format("MMM");
      if (labels.length === 0 || labels[labels.length - 1].name !== monthName) {
        labels.push({ name: monthName, index: i });
      }
    });
    return labels;
  }, [weeks]);

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
          <div className={`${styles.LegendCell} ${styles.Level_0}`} />
          <div className={`${styles.LegendCell} ${styles.Level_1}`} />
          <div className={`${styles.LegendCell} ${styles.Level_2}`} />
          <div className={`${styles.LegendCell} ${styles.Level_3}`} />
          <div className={`${styles.LegendCell} ${styles.Level_4}`} />
          <span>More</span>
        </div>
      </div>

      <div className={styles.Heatmap_Body}>
        {/* Day Labels Column */}
        <div className={styles.DayLabels}>
          {daysOfWeek.map((day, i) => (
            <span key={day} className={styles.LabelText}>
              {i % 2 !== 0 ? day : ""}
            </span>
          ))}
        </div>

        <div className={styles.Grid_Container}>
          {/* Month Labels Row */}
          <div className={styles.MonthLabels}>
            {monthLabels.map((month) => (
              <span
                key={`${month.name}-${month.index}`}
                className={styles.LabelText}
                style={{ gridColumn: month.index + 1 }}
              >
                {month.name}
              </span>
            ))}
          </div>

          {/* The Actual Grid */}
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
        </div>
      </div>
    </section>
  );
};

export default Heatmap;
