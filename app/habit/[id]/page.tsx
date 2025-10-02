"use client";
import { useEffect, useState } from "react";
import style from "@/app/Styles/Tracker/HabitDetails.module.css";
import { useParams, useRouter } from "next/navigation";
import HabitHistory from "@/app/components/Tracker/HabitHistory";
import HabitAction from "@/app/components/Tracker/HabitAction";
import HabitStat from "@/app/components/Tracker/HabitStat";
import DeleteDialog from "@/app/components/Tracker/DeleteDialog";
import EditDialog from "@/app/components/Tracker/EditDialog";
import { useHabits } from "@/app/context/HabitContext";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import Link from "next/link";

const HabitDetails = () => {
  const params = useParams();
  const id = Number(params?.id);
  const router = useRouter();

  const { habits, updateHabit, deleteHabit, resetHabit } = useHabits();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const habit = habits.find((habit) => habit.id === Number(id));

  useEffect(() => {
    if (!habit) return;

    const alreadyCongratulated = habit.streak > habit.target;
    if (habit.streak === habit.target && !alreadyCongratulated) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      });
      toast.success("🎉 Congratulations! You've reached your target!");
    }

    const milestoneStreak = [7, 30, 100];
    if (milestoneStreak.includes(habit.streak) && !alreadyCongratulated) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      toast.success(`🎉 Amazing! You've hit a ${habit.streak}-day streak!`);
    }
  }, [habit]);

  if (!habit) {
    return <p className={style.noFound}>Habit not found</p>;
  }

  const progress = Math.round((habit.streak / habit.target) * 100);

  const handleDone = () => {
    const today = new Date().toDateString();
    if (habit.history?.includes(today)) {
      toast.info("Already done for today.");
      return;
    }

    if (habit.streak < habit.target) {
      updateHabit(habit.id, {
        streak: habit.streak + 1,
        history: [...(habit.history || []), today],
      });
      toast.success("Streak increased 🔥");
    } else {
      toast.info("Target reached!");
    }
  };

  const handleReset = () => {
    resetHabit(habit.id);

    toast.info("Streak reset to 0. Keep going! 💪");
  };

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDialogOpen(false);

    deleteHabit(habit.id);
    toast.success("Habit deleted successfully! 🗑️");
    router.push("/tracker");
  };

  return (
    <>
      <section className={style.details}>
        <Link href="/tracker" className={style.backBtn} title="Back to Tracker">
          ← Back to Tracker
        </Link>
        <div className={style.card}>
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
        </div>

        <HabitHistory habit={habit} style={style} />
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
            updateHabit(habit.id, updatedData);
            toast.success("Habit updated successfully");
          }}
        />
      </section>
    </>
  );
};

export default HabitDetails;
