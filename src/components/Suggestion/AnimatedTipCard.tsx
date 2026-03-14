"use client";

import { useInView } from "react-intersection-observer";
import { Tip } from "@/components/Suggestion/SuggestionCard";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useReactor } from "@/Hooks/useReactor";
import { addHabitIntent, deleteHabitIntent } from "@/core/intent/habitIntents";
import { useRipple } from "@/Hooks/useRipple";
import styles from "@/Styles/Suggestion/SuggestionCard.module.css";
import toast from "@/utils/toast";
import logger from "@/utils/logger";
import Link from "next/link";
import { Habit } from "@/core/types/habit";
import { slugify } from "@/utils/slugify";
import { generateId } from "@/utils/generateId";
import { useRef } from "react";

interface AnimatedTipCardProps {
  tip: Tip;
  favorites: Tip[];
  setFavorites: React.Dispatch<React.SetStateAction<Tip[]>>;
  viewMode: "list" | "grid";
}

const AnimatedTipCard: React.FC<AnimatedTipCardProps> = ({
  tip,
  favorites,
  setFavorites,
  viewMode,
}) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const lastAddedHabitId = useRef<string | null>(null);

  const habits = useReactor<Habit[]>("habits") || [];

  const createRipple = useRipple();

  const displayIcon =
    typeof tip.icon === "string" ? tip.icon : String(tip.icon ?? "");
  const displayTitle =
    typeof tip.title === "string" ? tip.title : String(tip.title ?? "");

  const alreadyAdded = habits.some(
    (h) => h.title.toLowerCase() === displayTitle.toLowerCase(),
  );

  const handleAdd = () => {
    logger.info("Adding habit from suggestion", {
      title: displayTitle,
      icon: displayIcon,
    });
    const createdHabit = addHabitIntent({
      title: displayTitle,
      icon: displayIcon,
      target: 30,
      history: (tip.history as string[]) ?? [],
    });

    lastAddedHabitId.current = createdHabit.id;

    toast.success(
      <span>
        {`${displayTitle.trim()} ${displayIcon} added! `}
        <Link
          href="/tracker"
          style={{ color: "#4caf50", textDecoration: "underline" }}
        >
          Go to Tracker
        </Link>
        <button
          style={{
            marginLeft: 10,
            background: "none",
            border: "none",
            color: "#1976d2",
            cursor: "pointer",
            textDecoration: "underline",
            padding: 0,
            fontSize: "inherit",
          }}
          onPointerDown={(e) => createRipple(e)}
          onClick={() => handleUndo(createdHabit.id)}
        >
          Undo
        </button>
      </span>,
    );
  };

  const handleUndo = (habitId?: string | null) => {
    if (!habitId) return;

    deleteHabitIntent(habitId);

    toast.info(`${displayTitle.trim()} ${displayIcon} removed!`);
    lastAddedHabitId.current = null; // clear it
  };

  const toggleFavorite = () => {
    const isFavorite = favorites.some((fav) => fav.id === tip.id);
    setFavorites((prev) =>
      isFavorite ? prev.filter((fav) => fav.id !== tip.id) : [...prev, tip],
    );
    toast[isFavorite ? "info" : "success"](
      `${displayTitle} ${displayIcon} ${
        isFavorite ? "removed from" : "added to"
      } Favorites!`,
      { toastId: `fav-${tip.id}` },
    );
  };

  return (
    <motion.div
      ref={ref}
      layout
      key={tip.id}
      className={`${styles.SuggestionCard_Container} ${
        viewMode === "list" ? styles.SuggestionCard_ListView : styles.SuggestionCard_GridView
      }`}
      style={{ textAlign: "center" }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <button className={styles.SuggestionCard_HeartButton} onClick={toggleFavorite}>
        <FaHeart
          color={favorites.some((fav) => fav.id === tip.id) ? "red" : "gray"}
        />
      </button>

      <span className={styles.SuggestionCard_Icon} style={{ fontSize: "2rem" }}>
        {displayIcon}
      </span>

      <h3>{displayTitle}</h3>

      <button
        className={styles.SuggestionCard_ActionButton}
        onClick={handleAdd}
        disabled={alreadyAdded}
        onPointerDown={(e) => createRipple(e)}
        title={alreadyAdded ? "Already added" : "Add to habits"}
      >
        {alreadyAdded ? "Added ✅" : "Add Habit"}
      </button>
    </motion.div>
  );
};

export default AnimatedTipCard;
