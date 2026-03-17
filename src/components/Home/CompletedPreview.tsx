"use client";

import styles from "@/Styles/Home/CompletedPreview.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useReactor } from "@/Hooks/useReactor";
import { Habit } from "@/core/types/habit";
import ProgressTrack from "../UI/ProgressTracker";
import Link from "next/link";
import { LuTrophy, LuArrowRight, LuCircleCheck, LuStar } from "react-icons/lu";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const CompletedPreview: React.FC = () => {
  // 1. Pull real habits from global state
  const habits = useReactor<Habit[]>("habits") || [];

  // 2. Filter for completed habits (streak >= target) or just recently updated ones for demo
  // For a "SaaS" feel, if no real completions exist, we show high-quality placeholders
  const completedHabits = habits.filter(h => h.isCompleted || h.streak >= h.target);
  
  const displayHabits = completedHabits.length > 0 
    ? completedHabits.slice(0, 3) 
    : [
        { icon: "🎯", title: "Morning Routine", streak: 30, target: 30, id: "demo-1" },
        { icon: "💧", title: "Hydration Goal", streak: 21, target: 21, id: "demo-2" },
        { icon: "🧘", title: "Daily Zen", streak: 14, target: 14, id: "demo-3" },
      ];

  return (
    <section className={styles.CompletedPreview_Container}>
      <div className={styles.CompletedPreview_Header}>
        <div className={styles.CompletedPreview_TitleWrapper}>
          <LuTrophy className={styles.CompletedPreview_TitleIcon} />
          <h2 className={styles.CompletedPreview_Title}>Success Milestones</h2>
        </div>
        <Link href="/completed" className={styles.CompletedPreview_ViewAll}>
          View All <LuArrowRight />
        </Link>
      </div>

      <motion.div 
        className={styles.CompletedPreview_Grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <AnimatePresence>
          {displayHabits.map((habit) => {
            const progress = 100; // Since they are "completed"
            return (
              <motion.div 
                key={habit.id} 
                className={styles.CompletedPreview_Item}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div className={styles.CompletedPreview_Badge}>
                  <LuStar />
                </div>
                
                <div className={styles.CompletedPreview_IconBox}>
                  <span className={styles.CompletedPreview_Emoji}>{habit.icon}</span>
                  <LuCircleCheck className={styles.CompletedPreview_CheckIcon} />
                </div>

                <div className={styles.CompletedPreview_Content}>
                  <h3 className={styles.CompletedPreview_ItemTitle}>{habit.title}</h3>
                  <p className={styles.CompletedPreview_Streak}>
                    Mastered in {habit.streak} days
                  </p>
                </div>

                <div className={styles.CompletedPreview_ProgressWrapper}>
                   <ProgressTrack radius={45} stroke={6} progress={progress} />
                   <span className={styles.CompletedPreview_Percent}>100%</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {completedHabits.length === 0 && (
        <p className={styles.CompletedPreview_EmptyHint}>
          Showing achievement previews. Start tracking to see your own!
        </p>
      )}
    </section>
  );
};

export default CompletedPreview;
