import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProgressTrack from "@/components/UI/ProgressTracker";
import style from "@/Styles/Tracker/TrackerCard.module.css";
import { useRipple } from "@/Hooks/useRipple";
import React, { useState, useRef, useEffect } from "react";
import { Habit } from "@/core/types/habit";
import {
  completeHabitIntent,
  reorderHabitIntent,
} from "@/core/intent/habitIntents";
import { FaCheck, FaGripVertical } from "react-icons/fa";
import { notificationService } from "@/services/notificationService";
import dayjs from "dayjs";
import toast from "@/utils/toast";
import confetti from "canvas-confetti";
import logger from "@/utils/logger";

interface TrackerCardProps {
  habits: Habit[];
}

const TrackerCard: React.FC<TrackerCardProps> = ({ habits: initialHabits }) => {
  const [habits, setHabits] = useState(initialHabits);
  const [isDragging, setIsDragging] = useState(false);
  const draggedItem = useRef<Habit | null>(null);
  const draggedIdx = useRef<number | null>(null);
  const createRipple = useRipple();
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
    logger.info("Habits reordered", { count: habits.length });
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
      logger.info("Habit completed", {
        id: habit.id,
        title: habit.title,
        streak: habit.streak + 1,
      });
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

        notificationService.showStreakMilestone(
          habit.title,
          habit.icon,
          newStreak,
        );
      }
    }
  };

  return (
    <section aria-label="Your habits list">
      <div
        className={style.TrackerCard_Grid}
        onDragEnd={handleDragEnd}
        role="list"
      >
        <AnimatePresence>
          {habits.map((habit, index) => {
            const progress = Math.round((habit.streak / habit.target) * 100);

            const isCompletedToday = habit.history.includes(today);

            return (
              <motion.div
                key={habit.id || `habit-${index}`}
                className={`${style.TrackerCard_Container} ${isDragging ? style.isDragging : ""}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={() => handleDragOver(index)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                role="listitem"
                aria-label={`${habit.title}, streak: ${habit.streak} days, target: ${habit.target} days`}
              >
                <div
                  className={style.TrackerCard_DragHandle}
                  aria-label="Drag to reorder habit"
                >
                  <FaGripVertical aria-hidden="true" />
                </div>
                <button
                  className={`${style.TrackerCard_CompleteButton} ${
                    isCompletedToday ? style.isCompleted : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleQuickComplete(e, habit);
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    createRipple(e);
                  }}
                  title={
                    isCompletedToday ? "Completed today" : "Mark as complete"
                  }
                  aria-label={
                    isCompletedToday
                      ? `${habit.title} already completed today`
                      : `Mark ${habit.title} as complete`
                  }
                >
                  <FaCheck aria-hidden="true" />
                </button>

                <Link
                  href={habit.id ? `/habit/${habit.slug}` : "#"}
                  className={style.TrackerCard_Link}
                  onPointerDown={(e) => createRipple(e)}
                  title="Click for more details"
                >
                  <span className={style.TrackerCard_Icon}>{habit.icon}</span>
                  <h3 className={style.TrackerCard_Title}>{habit.title}</h3>
                  <p className={style.TrackerCard_Target}>
                    Target: {habit.target} days
                  </p>
                  <p className={style.TrackerCard_Streak}>
                    Streak: {habit.streak}
                  </p>
                  <ProgressTrack radius={50} stroke={5} progress={progress} />
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TrackerCard;
