import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProgressTrack from "@/app/components/ProgressTracker";
import style from "@/app/Styles/Tracker/TrackerCard.module.css";
import { useRipple } from "@/app/Hooks/useRipple";
import React, { useState, useRef, useEffect } from "react";
import { Habit } from "@/core/types/habit";
import {
  completeHabitIntent,
  reorderHabitIntent,
} from "@/core/intent/habitIntents";
import { FaCheck, FaGripVertical } from "react-icons/fa";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";

interface TrackerCardProps {
  habits: Habit[];
}

const TrackerCard: React.FC<TrackerCardProps> = ({ habits: initialHabits }) => {
  const [habits, setHabits] = useState(initialHabits);
  const [isDragging, setIsDragging] = useState(false);
  const draggedItem = useRef<Habit | null>(null);
  const draggedIdx = useRef<number | null>(null);
  const createRipple = useRipple();
  const router = useRouter();
  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    setHabits(initialHabits);
  }, [initialHabits]);

  const handleDragStart = (index: number) => {
    draggedIdx.current = index;
    draggedItem.current = habits[index];
    setIsDragging(true);
  };

  const handleDragOver = (index: number) => {
    if (draggedIdx.current === null) return;
    if (draggedIdx.current === index) return;

    const newHabits = [...habits];
    newHabits.splice(draggedIdx.current, 1);
    newHabits.splice(index, 0, draggedItem.current as Habit);
    draggedIdx.current = index;
    setHabits(newHabits);
  };

  const handleDragEnd = () => {
    reorderHabitIntent(habits.map((h) => h.id));
    draggedItem.current = null;
    draggedIdx.current = null;
    setIsDragging(false);
  };

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
      <div className={style.tipCard} onDragEnd={handleDragEnd}>
        <AnimatePresence>
          {habits.map((habit, index) => {
            const progress = Math.round((habit.streak / habit.target) * 100);

            const isCompletedToday = habit.history.includes(today);

            return (
              <motion.div
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={() => handleDragOver(index)}
                className={`${style.card} ${isDragging ? style.dragging : ""}`}
                key={habit.id || `habit-${index}`}
                onClick={() => {
                  if (habit.id) {
                    router.push(`/habit/${habit.slug}`);
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
                <div className={style.dragHandle}>
                  <FaGripVertical />
                </div>
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
