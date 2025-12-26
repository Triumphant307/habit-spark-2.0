"use client";

import { FaSun, FaMoon } from "react-icons/fa";
import style from "@/app/Styles/ThemeToggle.module.css";
import useLocalStorage from "@/app/Hooks/useLocalStorage";
import { useEffect, useState } from "react";

// View transition with bi-directional horizontal sweep animation for switching states in the document, eg. theme
export function toggleWithSweep(
  toggle = () => {},
  sweepForwards = true,
  transition = true
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
      }
    );
  });
}

const ThemeToggle = () => {
  const [isDark, setIsDark] = useLocalStorage("theme", false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark((prev) => (prev === undefined ? prefersDark : prev));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.body.classList.toggle("dark", isDark);
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  if (!mounted) return null; // prevent hydration mismatch

  return (
    <button
      className={`${style.themeToggle} ${isDark ? style.dark : style.light}`}
      onClick={() => toggleWithSweep(toggleTheme, !isDark, mounted)}
      aria-label="Toggle theme"
    >
      <span className={style.bgIcon} aria-hidden>
        {isDark ? (
          <FaSun color="#facc15" size={16} />
        ) : (
          <FaMoon color="#fff" size={16} />
        )}
      </span>

      <span className={style.knob}>
        <span className={style.knobIcon}>
          {isDark ? <FaMoon size={14} /> : <FaSun color="#facc15" size={14} />}
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
