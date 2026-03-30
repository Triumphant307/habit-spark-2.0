"use client";

import React, { useEffect, useState } from "react";
import styles from "@/Styles/Dashboard/DashboardComponents.module.css";
import dayjs from "dayjs";
import { useReactor } from "@/Hooks/useReactor";
import { Habit } from "@/core/types/habit";
import { LuCalendar } from "react-icons/lu";

const Greeting: React.FC = () => {
  const habits = useReactor<Habit[]>("habits") || [];
  const [nickname, setNickname] = useState<string>("HabitSparker");
  const [timeGreeting, setTimeGreeting] = useState<string>("Good day");

  useEffect(() => {
    // 1. Get nickname from localStorage (saved during onboarding)
    const storedOnboarding = localStorage.getItem("onboarding_data");
    if (storedOnboarding) {
      try {
        const data = JSON.parse(storedOnboarding);
        if (data.nickname) setNickname(data.nickname);
      } catch (e) {
        console.error("Failed to parse onboarding data", e);
      }
    }

    // 2. Set dynamic greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setTimeGreeting("Good Morning");
    else if (hour < 18) setTimeGreeting("Good Afternoon");
    else setTimeGreeting("Good Evening");
  }, []);

  const today = dayjs().format("YYYY-MM-DD");
  const remainingHabits = habits.filter(h => !h.history.includes(today)).length;

  return (
    <div className={styles.Greeting_Container}>
      <div className={styles.Greeting_Date}>
        <LuCalendar />
        {dayjs().format("dddd, MMMM D")}
      </div>
      <h1 className={styles.Greeting_Main}>
        {timeGreeting}, <span className={styles.Greeting_Nickname}>{nickname}</span>!
      </h1>
      {habits.length > 0 ? (
        <div className={styles.Greeting_Summary}>
          {remainingHabits === 0 
            ? "✨ All habits completed for today! You're on fire."
            : `🔥 You have ${remainingHabits} spark${remainingHabits > 1 ? 's' : ''} to ignite today.`
          }
        </div>
      ) : (
        <div className={styles.Greeting_Summary}>
          🌱 Ready to start your first habit?
        </div>
      )}
    </div>
  );
};

export default Greeting;
