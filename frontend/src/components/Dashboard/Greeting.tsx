"use client";

import React from "react";
import styles from "@/Styles/Dashboard/Greeting.module.css";
import layoutStyles from "@/Styles/Dashboard/Dashboard.module.css";
import dayjs from "dayjs";
import { useReactor } from "@/Hooks/useReactor";
import { Habit } from "@/core/types/habit";
import { LuCalendar, LuPlus, LuBell, LuMenu } from "react-icons/lu";
import ThemeToggle from "@/Theme/ThemeToggle";
import Link from "next/link";
import { getTimeGreeting } from "@/utils/dateUtils";
import { motion } from "framer-motion";
import { toggleMobileMenuIntent } from "@/core/intent/userIntents";

const Greeting: React.FC = () => {
  const habits = useReactor<Habit[]>("habits") || [];
  const nickname = useReactor<string>("user.nickname") || "HabitSparker";
  const timeGreeting = getTimeGreeting();

  const today = dayjs().format("YYYY-MM-DD");
  const remainingHabits = habits.filter(
    (h) => !h.history.includes(today),
  ).length;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  };

  return (
    <div className={layoutStyles.StickyHeader_Outer}>
      <header className={layoutStyles.Dashboard_Header}>
        <motion.div
          className={styles.Greeting_Container}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <div className={styles.Greeting_Info}>
            <button
              className={styles.Mobile_Menu_Button}
              onClick={() => toggleMobileMenuIntent()}
              aria-label="Open Menu"
            >
              <LuMenu />
            </button>
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
        </motion.div>
      </header>
    </div>
  );
};

export default Greeting;
