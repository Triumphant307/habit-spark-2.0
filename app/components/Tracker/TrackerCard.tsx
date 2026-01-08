import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProgressTrack from "@/app/components/ProgressTracker";
import style from "@/app/Styles/Tracker/TrackerCard.module.css";
import { useRipple } from "@/app/Hooks/useRipple";
import React from "react";
import { Habit, useHabits } from "@/app/context/HabitContext";
import { FaCheck } from "react-icons/fa";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";

interface TrackerCardProps {
  habits: Habit[];
}

const TrackerCard: React.FC<TrackerCardProps> = ({ habits }) => {
  const createRipple = useRipple();
  const { updateHabit } = useHabits();
  const router = useRouter()
  const today = dayjs().format("YYYY-MM-DD");

  const handleQuickComplete = (e: React.MouseEvent, habit: Habit) => {
    e.preventDefault(); // Prevent navigating to the detail page
    e.stopPropagation();

    const isCompletedToday = habit.history.includes(today);

    if (isCompletedToday) {
      toast.info("You've already completed this habit today!");
      return;
    }

    const newStreak = habit.streak + 1;
    const newHistory = [...habit.history, today];

    updateHabit(habit.id, {
      streak: newStreak,
      history: newHistory,
    });

    toast.success(`Great job! ${habit.title} completed.`);

    // Fire confetti from the button's position
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      origin: { x, y },
      particleCount: 50,
      spread: 60,
      colors: ["#10B981", "#3B82F6", "#F59E0B"],
    });
  };

  return (
    <section>
      <div className={style.tipCard}>
        {habits.map((habit) => {
          const progress = Math.round((habit.streak / habit.target) * 100);
          const isCompletedToday = habit.history.includes(today);

          return (
          
              <motion.div
                layout
                className={style.card}
                key={habit.id}
                onClick={() => router.push(`/habit/${habit.id}`)}
                onPointerDown={(e) => createRipple(e)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                title="Click for more details"
              >
                <button
                  className={`${style.quickCompleteBtn} ${
                    isCompletedToday ? style.completedBtn : ""
                  }`}
                  onClick={(e) => handleQuickComplete(e, habit)}
                  title={isCompletedToday ? "Completed today" : "Mark as complete"}
                >
                  <FaCheck />
                </button>

                <span className={style.habitIcon}>{habit.icon}</span>
                <h3 className={style.habitTitle}>{habit.title}</h3>
                <p className={style.habitTarget}>Target: {habit.target} days</p>
                <p className={style.habitStreak}>Streak: {habit.streak}</p>
                <ProgressTrack radius={50} stroke={5} progress={progress} />
              </motion.div>
            
          );
        })}
      </div>
    </section>
  );
};

export default TrackerCard;