"use client";

import React from "react";
import styles from "@/Styles/Dashboard/DashboardComponents.module.css";
import dayjs from "dayjs";
import { useReactor } from "@/Hooks/useReactor";
import { Habit } from "@/core/types/habit";
import { LuCalendar, LuPlus, LuBell } from "react-icons/lu";
import ThemeToggle from "@/Theme/ThemeToggle";
import Link from "next/link";
import { getTimeGreeting } from "@/utils/dateUtils";

const Greeting: React.FC = () => {
  const habits = useReactor<Habit[]>("habits") || [];
  const nickname = useReactor<string>("user.nickname") || "HabitSparker";
  const timeGreeting = getTimeGreeting();

  const today = dayjs().format("YYYY-MM-DD");
  const remainingHabits = habits.filter(
    (h) => !h.history.includes(today),
  ).length;

  return (
    <div className={styles.Greeting_Container}>
      <div className={styles.Greeting_Info}>
        <div className={styles.Greeting_Date}>
          <LuCalendar />
          {dayjs().format("dddd, MMMM D")}
        </div>
        <h1 className={styles.Greeting_Main}>
          {timeGreeting},{" "}
          <span className={styles.Greeting_Nickname}>{nickname}</span>!
        </h1>
        {habits.length > 0 ? (
          <div className={styles.Greeting_Summary}>
            {remainingHabits === 0
              ? "✨ All habits completed for today! You're on fire."
              : `🔥 You have ${remainingHabits} spark${remainingHabits > 1 ? "s" : ""} to ignite today.`}
          </div>
        ) : (
          <div className={styles.Greeting_Summary}>
            🌱 Ready to start your first habit?
          </div>
        )}
      </div>

      <div className={styles.Header_Actions}>
        <Link href="/suggestion">
          <button className={styles.Add_Button_Quick}>
            <LuPlus />
            <span>Add Habit</span>
          </button>
        </Link>
        <button
          className={styles.Action_Button}
          aria-label="View Notifications"
        >
          <LuBell />
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Greeting;
