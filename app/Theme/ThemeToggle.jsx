"use client";

import { FaSun, FaMoon } from "react-icons/fa";
import style from "@/app/Styles/ThemeToggle.module.css";
import useLocalStorage from "@/app/Hooks/useLocalStorage";
import { useEffect, useState } from "react";

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
    <button className={style.themeToggle} onClick={toggleTheme}>
      {isDark ? (
        <FaMoon
          size={24}
          color="#fff"
          className={style.iconTransition}
          style={{ transform: "rotate(-360deg)", opacity: 1 }}
        />
      ) : (
        <FaSun
          size={24}
          color="#facc15"
          className={style.iconTransition}
          style={{ transform: "rotate(360deg)", opacity: 1 }}
        />
      )}
    </button>
  );
};

export default ThemeToggle;
