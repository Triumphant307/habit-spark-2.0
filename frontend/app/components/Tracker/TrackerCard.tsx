import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProgressTrack from "@/app/components/ProgressTracker";
import style from "@/app/Styles/Tracker/TrackerCard.module.css";
import { useRipple } from "@/app/Hooks/useRipple";
import React from "react";
import { Habit } from "@/core/types/habit";
import { completeHabitIntent } from "@/core/intent/habitIntents";
import { FaCheck } from "react-icons/fa";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";

interface TrackerCardProps {
  habits: Habit[];
}

const TrackerCard: React.FC<TrackerCardProps> = ({ habits }) => {
  const createRipple = useRipple();
  const router = useRouter();
  const today = dayjs().format("YYYY-MM-DD");

  const handleQuickComplete = (e: React.MouseEvent, habit: Habit) => {
    e.preventDefault(); // Prevent navigating to the detail page
    e.stopPropagation();

    const milestoneStreaks = [7, 30, 100];
    const isCompletedToday = habit.history.includes(today);

    if (isCompletedToday) {
      toast.info("You've already completed this habit today!");
      return;
    }

    // Use the Intent to update state
    const success = completeHabitIntent(habit.id);

    if (success) {
      toast.success(`Great job! ${habit.title} completed.`);

      const newStreak = habit.streak + 1; // Calculate locally for visual feedback if needed immediately, though reactor will update prop

      // Fire confetti from the button's position
      if (milestoneStreaks.includes(newStreak)) {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          origin: { x, y },
          particleCount: 100,
          spread: 80,
          colors: ["#10B981", "#3B82F6", "#F59E0B"],
        });

        toast.success(`🎉 Amazing! You've hit a ${newStreak}-day streak!`);
      }
    }
  };

  return (
    <section>
      <div className={style.tipCard}>
        <AnimatePresence>
          {habits.map((habit, index) => {
            const progress = Math.round((habit.streak / habit.target) * 100);

            const isCompletedToday = habit.history.includes(today);

            return (
              <motion.div
                layout
                className={style.card}
                key={habit.id || `habit-${index}`}
                onClick={() => {
                  if (habit.id) {
                    router.push(`/habit/${habit.id}`);
                  } else {
                    console.error("Habit ID is missing", habit);
                  }
                }}
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
                  onPointerDown={(e) => createRipple(e)}
                  title={
                    isCompletedToday ? "Completed today" : "Mark as complete"
                  }
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
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TrackerCard;
