"use client";

import { useInView } from "react-intersection-observer";
import { Tip } from "@/core/types/app";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { LuPlus, LuCheck } from "react-icons/lu";
import { useReactor } from "sia-reactor/adapters/react";
import { appStore } from "@/core/store/app";
import { addHabit, deleteHabit } from "@/core/store/habits";
import { useRipple } from "@/Hooks/useRipple";
import styles from "@/Styles/Suggestion/SuggestionCard.module.css";
import toast from "@/utils/toast";
import logger from "@/utils/logger";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/UI/Button";

interface AnimatedTipCardProps {
  tip: Tip;
  viewMode: "list" | "grid";
}

const AnimatedTipCard: React.FC<AnimatedTipCardProps> = ({ tip, viewMode }) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const lastAddedHabitId = useRef<string | null>(null);
  const router = useRouter();

  const s = useReactor(appStore);
  const createRipple = useRipple();

  // Initialization: Decision made by global state
  const isCurrentlyFavorite = (s.suggestions.favorites || []).some((fav) => fav.id === tip.id);

  const [isOptimisticAdded, setIsOptimisticAdded] = useState(false);
  const [isOptimisticFavorite, setIsOptimisticFavorite] = useState(isCurrentlyFavorite);

  // Sync Layer: Ensures local state matches global truth if changed externally
  useEffect(() => {
    setIsOptimisticFavorite(isCurrentlyFavorite);
  }, [isCurrentlyFavorite]);

  const displayIcon = typeof tip.icon === "string" ? tip.icon : String(tip.icon ?? "");
  const displayTitle = typeof tip.title === "string" ? tip.title : String(tip.title ?? "");

  const alreadyAdded = s.habits.some((h) => h.title.toLowerCase() === displayTitle.toLowerCase());

  const handleAdd = () => {
    setIsOptimisticAdded(true);

    logger.info("Adding habit from suggestion", {
      title: displayTitle,
      icon: displayIcon,
    });

    const createdHabit = addHabit({
      title: displayTitle,
      icon: displayIcon,
      target: 30,
      history: (tip.history as string[]) ?? [],
    });

    lastAddedHabitId.current = createdHabit.id;

    toast.success(`${displayTitle.trim()} ${displayIcon} added!`, {
      id: createdHabit.id,
      tag: `suggestion-added-${createdHabit.id}`,
      autoClose: 7000,
      actions: {
        "Go to Tracker": () => {
          toast.dismiss(createdHabit.id);
          router.push("/tracker");
        },
        Undo: () => handleUndo(createdHabit.id),
      },
    });
  };

  const handleUndo = (habitId?: string | null) => {
    if (!habitId) return;
    setIsOptimisticAdded(false);
    deleteHabit(habitId);
    toast.info(habitId, {
      render: `${displayTitle.trim()} ${displayIcon} removed!`,
      actions: false,
    });
    lastAddedHabitId.current = null;
  };

  const toggleFavorite = () => {
    // 1. Instant UI Flip
    const newFavoriteState = !isOptimisticFavorite;
    setIsOptimisticFavorite(newFavoriteState);

    // 2. State Mutation
    if (!newFavoriteState) {
      s.suggestions.favorites = (s.suggestions.favorites || []).filter((fav) => fav.id !== tip.id);
    } else {
      s.suggestions.favorites = [...(s.suggestions.favorites || []), tip];
    }

    // 3. Feedback
    toast[newFavoriteState ? "success" : "info"](
      `${displayTitle} ${displayIcon} ${newFavoriteState ? "added to" : "removed from"} Favorites!`,
      { tag: `fav-${tip.id}` },
    );
  };

  const isButtonDisabled = alreadyAdded || isOptimisticAdded;

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
      <button
        type="button"
        title="Toggle favorite"
        className={styles.SuggestionCard_HeartButton}
        onClick={toggleFavorite}
      >
        <FaHeart color={isOptimisticFavorite ? "#ef4444" : "#94a3b8"} />
      </button>

      <span className={styles.SuggestionCard_Icon}>{displayIcon}</span>

      <h3>{displayTitle}</h3>

      <Button
        className={styles.SuggestionCard_ActionButton}
        onClick={handleAdd}
        disabled={isButtonDisabled}
        onPointerDown={(e) => createRipple(e)}
        title={isButtonDisabled ? "Already added" : "Add to habits"}
        showIcon
        icon={isButtonDisabled ? <LuCheck /> : <LuPlus />}
      >
        {isButtonDisabled ? "Added" : "Add Habit"}
      </Button>
    </motion.div>
  );
};

export default AnimatedTipCard;
