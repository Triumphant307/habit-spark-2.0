"use client";

import React, { useEffect } from "react";
import styles from "@/Styles/Layout/Sidebar.module.css";
import { useReactor } from "sia-reactor/adapters/react";
import { appState } from "@/core/state/app";
import {
  toggleSidebar,
  toggleMobileMenu,
} from "@/core/state/user";
import {
  LuLayoutDashboard,
  LuListTodo,
  LuSparkles,
  LuSettings,
  LuBell,
  LuChevronLeft,
  LuChevronRight,
  LuX,
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
  const s = useReactor(appState);
  const pathname = usePathname();

  // Logic: Show labels if mobile menu is open OR if desktop sidebar is NOT collapsed
  const showLabels = s.user.preferences.mobileMenuOpen || !s.user.preferences.sidebarCollapsed;

  useEffect(() => {
    if (s.user.preferences.mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [s.user.preferences.mobileMenuOpen]);

  // Don't show sidebar on auth/onboarding pages
  const hideOnPages = ["/login", "/signup", "/onboarding", "/"];
  if (hideOnPages.includes(pathname)) return null;

  const closeMobileMenu = () => toggleMobileMenu(false);

  return (
    <>
      {/* Dark Overlay for Mobile */}
      <div
        className={`${styles.Mobile_Overlay} ${s.user.preferences.mobileMenuOpen ? styles.Mobile_Overlay_Active : ""}`}
        onClick={closeMobileMenu}
      />

      <aside
        className={`${styles.Sidebar_Container} ${s.user.preferences.mobileMenuOpen ? styles.Mobile_Open : ""}`}
        style={{ width: s.user.preferences.sidebarCollapsed ? "70px" : "220px" }}
      >
        <div className={styles.Sidebar_Header}>
          <AnimatePresence mode="wait">
            {showLabels && (
              <motion.span
                className={styles.Logo}
                key="logo"
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
            onClick={() =>
              s.user.preferences.mobileMenuOpen ? toggleMobileMenu() : toggleSidebar()
            }
            aria-label="Toggle Navigation"
          >
            {s.user.preferences.mobileMenuOpen ? (
              <LuX />
            ) : s.user.preferences.sidebarCollapsed ? (
              <LuChevronRight />
            ) : (
              <LuChevronLeft />
            )}
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
                title={s.user.preferences.sidebarCollapsed ? item.label : ""}
                onClick={closeMobileMenu}
              >
                <span className={styles.Nav_Icon}>{item.icon}</span>
                <AnimatePresence mode="wait">
                  {showLabels && (
                    <motion.span
                      className={styles.Nav_Label}
                      key={item.label}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
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
              title={s.user.preferences.sidebarCollapsed ? item.label : ""}
              onClick={closeMobileMenu}
            >
              <span className={styles.Nav_Icon}>{item.icon}</span>
              <AnimatePresence mode="wait">
                {showLabels && (
                  <motion.span
                    className={styles.Nav_Label}
                    key={item.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

