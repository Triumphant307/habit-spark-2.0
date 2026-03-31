"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LinearProgressBar from "@/components/UI/LinearProgressBar";
import style from "@/Styles/Tracker/TrackerCard.module.css";
import { useRipple } from "@/Hooks/useRipple";
import React, { useState, useRef, useEffect } from "react";
import { Habit } from "@/core/types/habit";
import {
  completeHabitIntent,
  reorderHabitIntent,
} from "@/core/intent/habitIntents";
import { FaCheck, FaGripVertical } from "react-icons/fa";
import dayjs from "dayjs";
import toast from "@/utils/toast";
import { LuFlame } from "react-icons/lu";
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
    e.preventDefault();
    e.stopPropagation();

    const isCompletedToday = habit.history.includes(today);

    if (isCompletedToday) {
      toast.info("Already sparked for today!");
      return;
    }

    const success = completeHabitIntent(habit.id);

    if (success) {
      const newStreak = habit.streak + 1;

      // Feedback
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        origin: { x, y },
        particleCount: 40,
        spread: 50,
        colors: ["#3B82F6", "#6366F1"],
      });

      toast.success(`${habit.title} ignited!`);
    }
  };

  return (
    <section aria-label="Your habits list" className={style.TrackerCard_Grid}>
      <AnimatePresence>
        {habits.map((habit, index) => {
          const progress = Math.round((habit.streak / habit.target) * 100);
          const isCompletedToday = habit.history.includes(today);

          return (
            <motion.div
              key={habit.id || `habit-${index}`}
              className={`${style.TrackerCard_Container} ${
                isDragging ? style.isDragging : ""
              }`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={() => handleDragOver(index)}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              role="listitem"
            >
             
              <div className={style.TrackerCard_DragHandle}>
                <FaGripVertical />
              </div>

              
              <div className={style.TrackerCard_IconWrapper}>{habit.icon}</div>

              
              <Link
                href={`/habit/${habit.slug}`}
                className={style.TrackerCard_Content}
                onPointerDown={(e) => createRipple(e)}
              >
                <div className={style.TrackerCard_Header}>
                  <h3 className={style.TrackerCard_Title}>{habit.title}</h3>
                  <span className={style.TrackerCard_Streak}>
                    <LuFlame
                      size={12}
                      style={{ marginRight: "4px", color: "#f97316" }}
                    />
                    {habit.streak}
                  </span>
                </div>
                <div className={style.TrackerCard_ProgressWrapper}>
                  <LinearProgressBar progress={progress} />
                </div>
              </Link>

              
              <button
                className={`${style.TrackerCard_CompleteButton} ${
                  isCompletedToday ? style.isCompleted : ""
                }`}
                onClick={(e) => handleQuickComplete(e, habit)}
                onPointerDown={(e) => createRipple(e)}
                title={isCompletedToday ? "Completed today" : "Spark habit"}
              >
                <FaCheck />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </section>
  );
};

export default TrackerCard;
