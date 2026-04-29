"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LinearProgressBar from "@/components/UI/LinearProgressBar";
import style from "@/Styles/Tracker/TrackerCard.module.css";
import { rippleHandler } from "@t007/utils/hooks/vanilla";
import React, { useState, useRef } from "react";
import { Habit } from "@/core/types/habit";
import { completeHabit, updateHabit, deleteHabit, reorderByIds } from "@/core/store/habits";
import { FaCheck, FaGripVertical } from "react-icons/fa";
import { LuFlame } from "react-icons/lu";
import dayjs from "dayjs";
import toast from "@/utils/toast";
import confetti from "canvas-confetti";
import logger from "@/utils/logger";
import EditDialog from "./EditDialog";
import DeleteDialog from "./DeleteDialog";
import TrackerMenu from "./TrackerMenu";
import { useReactor } from "sia-reactor/adapters/react";
import { appStore } from "@/core/store/app";
import { useScrollAssist } from "@t007/utils/hooks/react";
import { HighlightText } from "@t007/utils/components/react";

const TrackerTitle: React.FC<{ title: string; query: string }> = ({ title, query }) => {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  useScrollAssist(titleRef, { vertical: false });
  return (
    <div className={style.TrackerCard_TitleSlot}>
      <h3 tabIndex={-1} ref={titleRef} className={`${style.TrackerCard_Title}`}>
        <HighlightText query={query}>{title}</HighlightText>
      </h3>
    </div>
  );
};

interface TrackerCardProps {
  visibleHabits: Habit[]; // Still takes props for filtering (e.g., Search or Top 6)
  query?: string;
}

const TrackerCard: React.FC<TrackerCardProps> = ({ visibleHabits, query = "" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);
  const draggedItem = useRef<Habit | null>(null);
  const draggedIdx = useRef<number | null>(null);
  const today = dayjs().format("YYYY-MM-DD");

  useReactor(appStore); // This ensures that when habits are updated anywhere, this list re-renders.

  const handleDragStart = (index: number) => {
    draggedIdx.current = index;
    draggedItem.current = visibleHabits[index];
    setIsDragging(true);
  };

  const handleDragOver = (index: number) => {
    if (draggedIdx.current === null || draggedIdx.current === index) return;
    const movingItem = visibleHabits[draggedIdx.current];
    draggedIdx.current = index;
    reorderByIds(movingItem.id, visibleHabits[index].id);
  };

  const handleDragEnd = () => {
    logger.info("Habits reordered", { count: visibleHabits.length });
    draggedItem.current = draggedIdx.current = null;
    setIsDragging(false);
  };

  const handleQuickComplete = (e: React.MouseEvent, habit: Habit) => {
    e.preventDefault();
    e.stopPropagation();

    const isCompletedToday = habit.history.includes(today);

    if (isCompletedToday) {
      toast.info("AlreadySpark for today!", { icon: habit.icon, tag: `${habit.id}Spark` });
      return;
    }

    const success = completeHabit(habit.id);

    if (success) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({ origin: { x, y }, particleCount: 40, spread: 50, colors: ["#3B82F6", "#6366F1"] });

      toast.success(`${habit.title} ignited!`, { icon: habit.icon, tag: `${habit.id}Spark` });
    }
  };

  return (
    <>
      <section aria-label="Your habits list" className={style.TrackerCard_Grid}>
        <AnimatePresence>
          {visibleHabits.map((habit, index) => {
            const progress = Math.round((habit.streak / habit.target) * 100);
            const isCompletedToday = habit.history.includes(today);

            return (
              <motion.div
                key={habit.id || `habit-${index}`}
                className={`${style.TrackerCard_Container} ${
                  isDragging ? style.isDragging : ""
                } ${isCompletedToday ? style.isCompleted : ""} ${activeMenu === habit.id ? style.isActive : ""}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={() => handleDragOver(index)}
                onDragEnd={handleDragEnd}
                layout
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

                <Link href={`/habit/${habit.slug}`} className={style.TrackerCard_Content} onPointerDown={rippleHandler}>
                  <div className={style.TrackerCard_Header}>
                    <TrackerTitle title={habit.title} query={query} />
                    <span className={style.TrackerCard_Streak}>
                      <LuFlame
                        size={12}
                        style={{
                          marginRight: "4px",
                          color: isCompletedToday ? "var(--color-text-muted)" : "#f97316",
                        }}
                      />
                      {habit.streak}
                    </span>
                  </div>
                  <div className={style.TrackerCard_ProgressWrapper}>
                    <LinearProgressBar progress={progress} />
                  </div>
                </Link>

                <div className={style.TrackerCard_Actions}>
                  <motion.button
                    className={`${style.TrackerCard_CompleteButton} ${isCompletedToday ? style.isCompleted : ""}`}
                    onClick={(e) => handleQuickComplete(e, habit)}
                    onPointerDown={rippleHandler}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    title={isCompletedToday ? "Completed today" : "Spark habit"}
                  >
                    <FaCheck />
                  </motion.button>

                  <TrackerMenu
                    isOpen={activeMenu === habit.id}
                    onToggle={() => setActiveMenu(activeMenu === habit.id ? null : habit.id)}
                    onClose={() => setActiveMenu(null)}
                    onEdit={() => setEditingHabit(habit)}
                    onDelete={() => setDeletingHabitId(habit.id)}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </section>

      <EditDialog
        isOpen={!!editingHabit}
        habit={editingHabit}
        onClose={() => setEditingHabit(null)}
        onSave={(id, fields) => updateHabit(id, fields)}
      />

      <DeleteDialog
        isOpen={!!deletingHabitId}
        onClose={() => setDeletingHabitId(null)}
        onConfirm={() => {
          if (deletingHabitId) deleteHabit(deletingHabitId);
          setDeletingHabitId(null);
        }}
      />
    </>
  );
};

export default TrackerCard;
