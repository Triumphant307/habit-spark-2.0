"use client";

import React from "react";
import styles from "@/Styles/Layout/Sidebar.module.css";
import { useReactor } from "@/Hooks/useReactor";
import { toggleSidebarIntent } from "@/core/intent/userIntents";
import {
  LuLayoutDashboard,
  LuListTodo,
  LuSparkles,
  LuSettings,
  LuBell,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <LuLayoutDashboard /> },
  { label: "Full Tracker", href: "/tracker", icon: <LuListTodo /> },
  { label: "Suggestions", href: "/suggestion", icon: <LuSparkles /> },
];

const footerItems = [
  { label: "Notifications", href: "#", icon: <LuBell /> },
  { label: "Settings", href: "#", icon: <LuSettings /> },
];

const Sidebar: React.FC = () => {
  const isCollapsed = useReactor<boolean>("user.preferences.sidebarCollapsed");
  const pathname = usePathname();

  // Don't show sidebar on auth/onboarding pages
  const hideOnPages = ["/login", "/signup", "/onboarding", "/"];
  if (hideOnPages.includes(pathname)) return null;

  return (
    <aside
      className={styles.Sidebar_Container}
      style={{ width: isCollapsed ? "70px" : "220px" }}
    >
      <div className={styles.Sidebar_Header}>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              className={styles.Logo}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              HabitSpark
            </motion.span>
          )}
        </AnimatePresence>
        <button
          className={styles.Toggle_Button}
          onClick={() => toggleSidebarIntent()}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <LuChevronRight /> : <LuChevronLeft />}
        </button>
      </div>

      <nav className={styles.Sidebar_Nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.Nav_Item} ${isActive ? styles.Nav_Item_Active : ""}`}
              title={isCollapsed ? item.label : ""}
            >
              <span className={styles.Nav_Icon}>{item.icon}</span>
              {!isCollapsed && (
                <motion.span
                  className={styles.Nav_Label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={styles.Sidebar_Footer}>
        {footerItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={styles.Nav_Item}
            title={isCollapsed ? item.label : ""}
          >
            <span className={styles.Nav_Icon}>{item.icon}</span>
            {!isCollapsed && (
              <motion.span
                className={styles.Nav_Label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item.label}
              </motion.span>
            )}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
