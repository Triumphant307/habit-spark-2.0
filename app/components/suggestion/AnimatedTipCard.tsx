"use client";

import { useInView } from "react-intersection-observer";
import { Tip } from "@/app/components/suggestion/SuggestionCard";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useReactor } from "@/app/Hooks/useReactor";
import { addHabitIntent, deleteHabitIntent } from "@/core/intent/habitIntents";
import { useRipple } from "@/app/Hooks/useRipple";
import styles from "@/app/Styles/Suggestion/suggestionCard.module.css";
import { toast } from "react-toastify";
import Link from "next/link";
import { Habit } from "@/core/types/habit";

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

  const habits = useReactor<Habit[]>("habits") || [];
  

  const createRipple = useRipple();

  // tip.id comes from the shared `Tip` type and may be string | number | undefined.
  // Coerce/normalize to a number when comparing with Habit.id (which is a number).
  const tipIdRaw = tip.id;
  const tipId =
    tipIdRaw == null
      ? undefined
      : typeof tipIdRaw === "number"
      ? tipIdRaw
      : parseInt(String(tipIdRaw), 10);

  const alreadyAdded = tipId != null && habits.some((h) => h.id === tipId);

  const displayIcon =
    typeof tip.icon === "string" ? tip.icon : String(tip.icon ?? "");
  const displayTitle =
    typeof tip.title === "string" ? tip.title : String(tip.title ?? "");

  const handleAdd = () => {
    const newHabit = {
      id: tipId ?? Date.now(),
      title: displayTitle,
      icon: displayIcon,
      target: 30,
      streak: 0,
      history: (tip.history as string[]) ?? [],
    };

    if (!habits.some((h) => h.id === newHabit.id)) {
      addHabitIntent(newHabit);
    }

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
          onClick={() => handleUndo(tip.id)}
        >
          Undo
        </button>
      </span>
    );
  };

  const handleUndo = (id?: string | number) => {
    if (id == null) return;
    const numId = typeof id === "number" ? id : parseInt(String(id), 10);
    if (Number.isNaN(numId)) return;
    deleteHabitIntent(numId);

    toast.info(`${displayTitle.trim()} ${displayIcon} removed!`);
  };

  const toggleFavorite = () => {
    const isFavorite = favorites.some((fav) => fav.id === tip.id);
    setFavorites((prev) =>
      isFavorite ? prev.filter((fav) => fav.id !== tip.id) : [...prev, tip]
    );
    toast[isFavorite ? "info" : "success"](
      `${displayTitle} ${displayIcon} ${
        isFavorite ? "removed from" : "added to"
      } Favorites!`,
      { toastId: `fav-${tip.id}` }
    );
  };

  return (
    <motion.div
      ref={ref}
      layout
      key={tip.id}
      className={`${styles.card} ${
        viewMode === "list" ? styles.listView : styles.gridView
      }`}
      style={{ textAlign: "center" }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <button className={styles.btnHeart} onClick={toggleFavorite}>
        <FaHeart
          color={favorites.some((fav) => fav.id === tip.id) ? "red" : "gray"}
        />
      </button>

      <span className={styles.icon} style={{ fontSize: "2rem" }}>
        {displayIcon}
      </span>

      <h3>{displayTitle}</h3>

      <button
        className={styles.btn}
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
