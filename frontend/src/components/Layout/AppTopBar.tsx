"use client";

import React, { useState } from "react";
import styles from "@/Styles/Layout/AppTopBar.module.css";
import { LuPlus, LuBell, LuMenu } from "react-icons/lu";
import ThemeToggle from "@/Theme/ThemeToggle";
import { toggleMobileMenu } from "@/core/store/user";
import QuickAddModal from "../Dashboard/QuickAddModal";

const AppTopBar: React.FC = () => {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <>
      <div className={styles.TopBar_Container}>
        <div className={styles.TopBar_Inner}>
          <div className={styles.TopBar_Left}>
            <button className={styles.Mobile_Menu_Button} onClick={() => toggleMobileMenu()} aria-label="Open Menu">
              <LuMenu />
            </button>
          </div>

          <div className={styles.TopBar_Right}>
            <button
              className={styles.Add_Button_Quick}
              onClick={() => setIsQuickAddOpen(true)}
              aria-label="Quick add a new habit"
            >
              <LuPlus />
              <span>Add Habit</span>
            </button>
            <button className={styles.Action_Button} aria-label="View Notifications">
              <LuBell />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
    </>
  );
};

export default AppTopBar;
