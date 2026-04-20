"use client";
import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import styles from "@/Styles/Layout/ThemeToggle.module.css";
import { useState, useLayoutEffect } from "react";
import { useReactor } from "sia-reactor/adapters/react";
import { appState } from "@/core/state/app";

// View transition with bi-directional horizontal sweep animation for switching states in the document, eg. theme
export function toggleWithSweep(
  toggle: () => void = () => {},
  sweepForwards: boolean = true,
  transition: boolean = true,
) {
  if (!document.startViewTransition || !transition) return toggle();
  document.startViewTransition(toggle).ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          sweepForwards ? `inset(0 99.9% 0 0)` : `inset(0 0 0 99.9%)`,
          `inset(0 0 0 0)`,
        ],
      },
      {
        duration: 350,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
}

const ThemeToggle = React.memo((): React.JSX.Element | null => {
  const s = useReactor(appState);
  const isDark = s.theme === "dark";
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (s.theme === undefined) s.theme = prefersDark ? "dark" : "light";
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (mounted) document.documentElement.classList.toggle("dark", isDark);
  }, [isDark, mounted]);

  const toggleTheme = () => {
    s.theme = isDark ? "light" : "dark";
  };

  if (!mounted) return null; // prevent hydration mismatch

  return (
    <button
      className={styles.ThemeToggle_Container}
      onClick={() => toggleWithSweep(toggleTheme, !isDark, mounted)}
      aria-label="Toggle theme"
    >
      <div className={styles.ThemeToggle_BackgroundIcon} aria-hidden>
        <FaSun size={12} />
        <FaMoon size={12} />
      </div>

      <span className={styles.ThemeToggle_Knob}>
        <span className={styles.ThemeToggle_KnobIcon}>
          {isDark ? (
            <FaMoon size={14} />
          ) : (
            <FaSun
              size={14}
              style={{ color: "var(--color-status-sun-icon)" }}
            />
          )}
        </span>
      </span>
    </button>
  );
});

export default ThemeToggle;
