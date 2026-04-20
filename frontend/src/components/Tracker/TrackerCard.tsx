"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LinearProgressBar from "@/components/UI/LinearProgressBar";
import style from "@/Styles/Tracker/TrackerCard.module.css";
import { useRipple } from "@/Hooks/useRipple";
import React, { useState, useRef, useEffect } from "react";
import { Habit } from "@/core/types/habit";
import { reorderHabits, completeHabit, updateHabit, deleteHabit } from "@/core/store/habits";
import { FaCheck, FaGripVertical } from "react-icons/fa";
import { LuFlame, LuMoveVertical, LuPencil, LuTrash2 } from "react-icons/lu";
import dayjs from "dayjs";
import toast from "@/utils/toast";
import confetti from "canvas-confetti";
import logger from "@/utils/logger";
import EditDialog from "./EditDialog";
import DeleteDialog from "./DeleteDialog";
import { useReactor } from "sia-reactor/adapters/react";
import { appStore } from "@/core/store/app";

interface TrackerCardProps {
  habits: Habit[]; // Still takes props for filtering (e.g., Search or Top 6)
}

const TrackerCard: React.FC<TrackerCardProps> = ({ habits }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);

  // We assign the reactor to 's' so the component explicitly subscribes to changes.
  // This ensures that when habits are updated anywhere, this list re-renders.
  useReactor(appStore);

  const draggedItem = useRef<Habit | null>(null);
  const draggedIdx = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const createRipple = useRipple();
  const today = dayjs().format("YYYY-MM-DD");

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  const handleDragStart = (index: number) => {
    draggedIdx.current = index;
    draggedItem.current = habits[index];
    setIsDragging(true);
  };

  const handleDragOver = (index: number) => {
    if (draggedIdx.current === null) return;
    if (draggedIdx.current === index) return;

    // Mutate the array directly - Reactor will handle the UI update
    const movingItem = habits[draggedIdx.current];
    habits.splice(draggedIdx.current, 1);
    habits.splice(index, 0, movingItem);
    draggedIdx.current = index;
  };

  const handleDragEnd = () => {
    logger.info("Habits reordered", { count: habits.length });
    // Persist the new order to global state and localStorage
    reorderHabits(habits.map((h) => h.id));
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

    const success = completeHabit(habit.id);

    if (success) {
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
    <>
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
                    onPointerDown={(e) => createRipple(e)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    title={isCompletedToday ? "Completed today" : "Spark habit"}
                  >
                    <FaCheck />
                  </motion.button>

                  <div className={style.Menu_Wrapper}>
                    <button
                      className={style.More_Button}
                      onClick={() => setActiveMenu(activeMenu === habit.id ? null : habit.id)}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                      }}
                      aria-label="More options"
                    >
                      <LuMoveVertical />
                    </button>

                    <AnimatePresence>
                      {activeMenu === habit.id && (
                        <motion.div
                          ref={menuRef}
                          className={style.Dropdown_Menu}
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEditingHabit(habit);
                              setActiveMenu(null);
                            }}
                          >
                            <LuPencil size={14} /> Edit Spark
                          </button>
                          <button
                            className={style.Delete_Option}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeletingHabitId(habit.id);
                              setActiveMenu(null);
                            }}
                          >
                            <LuTrash2 size={14} /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
