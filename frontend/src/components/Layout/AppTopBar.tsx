"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import layoutStyles from "@/Styles/Dashboard/Dashboard.module.css";
import styles from "@/Styles/Dashboard/Greeting.module.css";
import { LuCalendar, LuPlus, LuBell, LuMenu } from "react-icons/lu";
import ThemeToggle from "@/Theme/ThemeToggle";
import QuickAddModal from "@/components/Dashboard/QuickAddModal";
import { toggleMobileMenu } from "@/core/state/user";

/**
 * AppTopBar — sticky top navigation bar shared across all app routes
 * (dashboard, tracker, suggestion, habit detail).
 *
 * Owns the QuickAddModal state so the "Add Habit" shortcut is available
 * everywhere the sidebar is present, not just on the dashboard.
 */
const AppTopBar: React.FC = () => {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <>
      <div className={layoutStyles.TopBar_Sticky}>
        <div className={layoutStyles.Dashboard_Header}>
          <div className={styles.Greeting_Container}>
            {/* Left — hamburger (mobile) + current date */}
            <div
              className={styles.Greeting_Info}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <button
                className={styles.Mobile_Menu_Button}
                onClick={() => toggleMobileMenu()}
                aria-label="Open sidebar menu"
              >
                <LuMenu />
              </button>
              <div className={styles.Greeting_Date} style={{ marginBottom: 0 }}>
                <LuCalendar />
                {dayjs().format("dddd, MMMM D")}
              </div>
            </div>

            {/* Right — global actions */}
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

      {/* QuickAddModal — available from any app route via the top bar */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </>
  );
};

export default AppTopBar;
