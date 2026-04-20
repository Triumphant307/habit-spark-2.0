"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import styles from "@/Styles/Tracker/HabitDetails.module.css";
import { useParams, useRouter } from "next/navigation";
import HabitHistory from "@/components/Tracker/HabitHistory";
import DeleteDialog from "@/components/Tracker/DeleteDialog";
import EditDialog from "@/components/Tracker/EditDialog";
import HabitNotFound from "@/components/Tracker/HabitNotFound";
import { resetHabit, updateHabit, deleteHabit, completeHabit, findHabitBySlug } from "@/core/store/habits";
import { useReactor } from "sia-reactor/adapters/react";
import { appStore } from "@/core/store/app";
import toast from "@/utils/toast";
import logger from "@/utils/logger";
import confetti from "canvas-confetti";
import { notificationService } from "@/services/notificationService";
import Link from "next/link";
import dayjs from "dayjs";
import { LuArrowLeft, LuCalendar, LuCheck, LuRotateCcw, LuPencil, LuTrash2 } from "react-icons/lu";
import Button from "@/components/UI/Button";

const HabitDetails = () => {
  const params = useParams();
  const router = useRouter();

  // Type-safe slug extraction
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || "";

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const s = useReactor(appStore);
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
      notificationService.showStreakMilestone(habit.title, habit.icon, habit.streak);
    }
  }, [habit]);

  if (!habit) return <HabitNotFound />;

  const today = dayjs().format("YYYY-MM-DD");
  const isCompletedToday = habit.history.includes(today);
  const completionRate =
    habit.history.length > 0
      ? Math.round((habit.history.length / (dayjs().diff(dayjs(habit.startDate), "day") + 1)) * 100)
      : 0;

  const handleDone = () => {
    if (isCompletedToday) {
      toast.info("Already sparked for today!");
      return;
    }

    logger.info("Marking habit done", { id: habit.id, title: habit.title });
    completeHabit(habit.id);
    toast.success(`${habit.title} ignited! 🔥`);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#3B82F6", "#6366F1"],
    });
  };

  const handleReset = () => {
    resetHabit(habit.id);
    toast.info("Streak reset. A new beginning! 💪");
  };

  const handleDelete = () => {
    deleteHabit(habit.id);
    toast.success("Habit removed.");
    router.push("/tracker");
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.section className={styles.HabitDetails} variants={containerVariants} initial="hidden" animate="visible">
      {/* 1. Header with Back Button */}
      <motion.div className={styles.HabitDetails_Header} variants={itemVariants}>
        <Link href="/tracker" className={styles.HabitDetails_BackButton}>
          <LuArrowLeft size={16} />
          Back to Tracker
        </Link>
      </motion.div>

      {/* 2. Main Hero Card */}
      <motion.div className={styles.HabitDetails_HeroCard} variants={itemVariants}>
        <div className={styles.Hero_MainInfo}>
          <div className={styles.HabitDetails_IconWrapper}>{habit.icon}</div>
          <div className={styles.Hero_Text}>
            <span className={styles.HabitDetails_Category}>{habit.category || "General"}</span>
            <h1 className={styles.HabitDetails_Title}>{habit.title}</h1>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.HabitDetails_StatsGrid}>
          <div className={styles.Stat_Item}>
            <span className={styles.Stat_Label}>Current Streak</span>
            <span className={styles.Stat_Value}>{habit.streak} Days</span>
          </div>
          <div className={styles.Stat_Item}>
            <span className={styles.Stat_Label}>Daily Target</span>
            <span className={styles.Stat_Value}>{habit.target} Days</span>
          </div>
          <div className={styles.Stat_Item}>
            <span className={styles.Stat_Label}>Completion Rate</span>
            <span className={styles.Stat_Value}>{completionRate}%</span>
          </div>
        </div>

        {/* Action Area */}
        <div className={styles.HabitDetails_ActionArea}>
          <div className={styles.Action_Group}>
            <Button onClick={handleDone} disabled={isCompletedToday} showIcon icon={<LuCheck />}>
              {isCompletedToday ? "Completed Today" : "Mark as Done"}
            </Button>
            <Button variant="secondary" onClick={() => setIsEditOpen(true)} showIcon icon={<LuPencil />}>
              Edit Spark
            </Button>
          </div>

          <div className={styles.Action_Group}>
            <Button variant="secondary" onClick={handleReset} showIcon icon={<LuRotateCcw />}>
              Reset
            </Button>
            <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(true)} showIcon icon={<LuTrash2 />}>
              Delete
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 3. History Visualization */}
      <motion.div className={styles.HabitDetails_HistorySection} variants={itemVariants}>
        <h2 className={styles.Section_Title}>
          <LuCalendar />
          Habit History
        </h2>
        <HabitHistory habit={habit} style={styles} />
      </motion.div>

      {/* Dialogs */}
      <EditDialog
        habit={habit}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={(id, fields) => {
          updateHabit(id, fields);
          toast.success("Changes saved!");
        }}
      />

      <DeleteDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={handleDelete} />
    </motion.section>
  );
};

export default HabitDetails;
