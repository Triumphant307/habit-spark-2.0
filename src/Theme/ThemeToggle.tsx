"use client";
import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import styles from "@/Styles/Layout/ThemeToggle.module.css";
import useLocalStorage from "@/Hooks/useLocalStorage";
import { useEffect, useState } from "react";

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
  const [isDark, setIsDark] = useLocalStorage<boolean | undefined>("theme", undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setIsDark((prev) => (prev === undefined ? prefersDark : prev));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
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
            <FaSun size={14} style={{ color: "var(--color-status-sun-icon)" }} />
          )}
        </span>
      </span>
    </button>
  );
});

export default ThemeToggle;
