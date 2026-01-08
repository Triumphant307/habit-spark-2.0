import Link from "next/link";
import { motion } from "framer-motion";
import ProgressTrack from "@/app/components/ProgressTracker";
import style from "@/app/Styles/Tracker/TrackerCard.module.css";
import { useRipple } from "@/app/Hooks/useRipple";
import React from "react";
import { Habit } from "@/app/context/HabitContext";

interface TrackerCardProps {
  habits: Habit[];
}
const TrackerCard: React.FC<TrackerCardProps> = ({ habits }) => {
  const createRipple = useRipple();

  return (
    <section>
      <div className={style.tipCard}>
        {habits.map((habit) => {
          const progress = Math.round((habit.streak / habit.target) * 100);
          return (
            <Link
              href={`/habit/${habit.id}`}
              className={style.cardLink}
              key={habit.id}
              title="Click for more details"
            >
              <motion.div
                layout
                className={style.card}
                onPointerDown={(e) => createRipple(e)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <span className={style.habitIcon}>{habit.icon}</span>
                <h3 className={style.habitTitle}>{habit.title}</h3>
                <p className={style.habitTarget}>Target: {habit.target} days</p>
                <p className={style.habitStreak}>Streak: {habit.streak}</p>
                <ProgressTrack radius={50} stroke={5} progress={progress} />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default TrackerCard;
