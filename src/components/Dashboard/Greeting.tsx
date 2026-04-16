"use client";

import React, { useState } from "react";
import styles from "@/Styles/Dashboard/Greeting.module.css";
import layoutStyles from "@/Styles/Dashboard/Dashboard.module.css";
import dayjs from "dayjs";
import { useReactor } from "sia-reactor/adapters/react";
import { appState } from "@/core/state/app";
import { LuCalendar, LuPlus, LuBell, LuMenu } from "react-icons/lu";
import ThemeToggle from "@/Theme/ThemeToggle";
import QuickAddModal from "./QuickAddModal";
import { getTimeGreeting } from "@/utils/dateUtils";
import { motion } from "framer-motion";
import { toggleMobileMenu } from "@/core/state/user";

const Greeting: React.FC = () => {
  const s = useReactor(appState);
  const timeGreeting = getTimeGreeting();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const today = dayjs().format("YYYY-MM-DD");
  const remainingHabits = s.habits.filter(
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
    <>
      {/* 1. STICKY TOP BAR: Date, Hamburger, and Global Actions */}
      <div className={layoutStyles.TopBar_Sticky}>
        <div className={layoutStyles.Dashboard_Header}>
          <div className={styles.Greeting_Container}>
            <div
              className={styles.Greeting_Info}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <button
                className={styles.Mobile_Menu_Button}
                onClick={() => toggleMobileMenu()}
                aria-label="Open Menu"
              >
                <LuMenu />
              </button>
              <div className={styles.Greeting_Date} style={{ marginBottom: 0 }}>
                <LuCalendar />
                {dayjs().format("dddd, MMMM D")}
              </div>
            </div>

            <div className={styles.Header_Actions}>
              <button
                className={styles.Add_Button_Quick}
                onClick={() => setIsQuickAddOpen(true)}
                aria-label="Quick add a new habit"
              >
                <LuPlus />
                <span>Add Habit</span>
              </button>
              <button
                className={styles.Action_Button}
                aria-label="View Notifications"
              >
                <LuBell />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* 2. SCROLLABLE WELCOME: The big personalized greeting */}
      <div
        className={layoutStyles.Dashboard_Header}
        style={{ paddingTop: "var(--spacing-xl)" }}
      >
        <motion.div initial="hidden" animate="visible" variants={itemVariants}>
          <h1 className={styles.Greeting_Main}>
            {timeGreeting},{" "}
            <span className={styles.Greeting_Nickname}>{s.user.nickname}</span>!
          </h1>
          {s.habits.length > 0 ? (
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
        </motion.div>
      </div>

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </>
  );
};

export default Greeting;
