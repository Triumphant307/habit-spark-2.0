"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import style from "@/app/Styles/Tracker/HabitDetails.module.css";
import { useParams, useRouter } from "next/navigation";
import HabitHistory from "@/app/components/Tracker/HabitHistory";
import HabitAction from "@/app/components/Tracker/HabitAction";
import HabitStat from "@/app/components/Tracker/HabitStat";
import DeleteDialog from "@/app/components/Tracker/DeleteDialog";
import EditDialog from "@/app/components/Tracker/EditDialog";
import HabitNotFound from "@/app/components/Tracker/HabitNotFound";
import {
  resetHabitIntent,
  updateHabitIntent,
  deleteHabitIntent,
  completeHabitIntent,
} from "@/core/intent/habitIntents";
import { findHabitBySlug } from "@/core/intent/habitIntents";
import { useReactor } from "@/app/Hooks/useReactor";
import toast from "@/app/utils/toast";
import confetti from "canvas-confetti";
import Link from "next/link";
import dayjs from "dayjs";

const HabitDetails = () => {
  const params = useParams();
  const router = useRouter();

  // Ensure `slug` is a string
  const slug = String(params?.slug);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const habits = useReactor("habits") || [];

  // Use the helper to find habit by slug
  const habit = findHabitBySlug(slug);

  useEffect(() => {
    if (!habit) return;

    const alreadyCongratulated = habit.streak > habit.target;
    if (habit.streak === habit.target && !alreadyCongratulated) {
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      toast.success("🎉 Congratulations! You've reached your target!");
    }

    const milestoneStreak = [7, 30, 100];
    if (milestoneStreak.includes(habit.streak) && !alreadyCongratulated) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      toast.success(`🎉 Amazing! You've hit a ${habit.streak}-day streak!`);
    }
  }, [habit]);

  if (!habit) return <HabitNotFound />;

  const progress = Math.round((habit.streak / habit.target) * 100);

  const handleDone = async () => {
    const today = dayjs().format("YYYY-MM-DD");
    if (habit.history.includes(today)) {
      toast.info("Already done for today.");
      return;
    }

    completeHabitIntent(habit.id);
    toast.success("Streak increased 🔥");
  };

  const handleReset = () => {
    resetHabitIntent(habit.id);
    toast.info("Streak reset to 0. Keep going! 💪");
  };

  const handleDeleteClick = () => setIsDialogOpen(true);
  const handleDelete = () => {
    deleteHabitIntent(habit.id);
    toast.success("Habit deleted successfully! 🗑️");
    router.push("/tracker");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <motion.section
      className={style.details}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Link href="/tracker" className={style.backBtn} title="Back to Tracker">
          ← Back to Tracker
        </Link>
      </motion.div>

      <motion.div className={style.card} variants={itemVariants}>
        <span className={style.icon}>{habit.icon}</span>
        <h2 className={style.title}>{habit.title}</h2>

        <HabitStat habit={habit} progress={progress} style={style} />
        <HabitAction
          habit={habit}
          handleDone={handleDone}
          handleReset={handleReset}
          handleDeleteClick={handleDeleteClick}
          handleEditClick={() => setIsEditOpen(true)}
          style={style}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <HabitHistory habit={habit} style={style} />
      </motion.div>

      <DeleteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDelete}
      />

      <EditDialog
        habit={habit}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={(updatedData) => {
          updateHabitIntent(habit.id, updatedData);
          toast.success("Habit updated successfully");
        }}
      />
    </motion.section>
  );
};

export default HabitDetails;
