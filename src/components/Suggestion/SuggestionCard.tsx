"use client";
import { motion, AnimatePresence } from "framer-motion";
import { getTipsByCategory } from "@/utils/getTipsByCatergory";
import styles from "@/Styles/Suggestion/SuggestionCard.module.css";
import Search from "@/components/UI/Search";
import { ToastContainer, toast } from "react-toastify";
import AnimatedTipCard from "@/components/Suggestion/AnimatedTipCard";
import { FaThLarge, FaList } from "react-icons/fa";
import { useReactor } from "sia-reactor/adapters/react";
import { appState } from "@/core/state/app";
import { useRipple } from "@/Hooks/useRipple";
import React, { useState, useRef } from "react";

const SuggestionCard: React.FC = () => {
  const s = useReactor(appState);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const resultRef = useRef(null);
  const createRipple = useRipple();

  const categories = [
    "All",
    "Health",
    "Wellness",
    "Learning",
    "Productivity",
    "Favorites",
  ];

  const filteredTips =
    s.suggestions.filter === "Favorites"
      ? (s.suggestions.favorites || []).filter((tip) =>
          tip.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : getTipsByCategory(
          s.suggestions.filter,
          s.suggestions.favorites || [],
        ).filter((tip) =>
          tip.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  return (
    <>
      <Search
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultRef={resultRef}
      />
      <div className={styles.SuggestionCard_ViewToggle}>
        <button
          className={
            s.suggestions.viewMode === "grid"
              ? styles.SuggestionCard_ViewToggle_Active
              : ""
          }
          onClick={() => (s.suggestions.viewMode = "grid")}
          aria-label="Grid View"
          title="Toggle grid"
        >
          <FaThLarge />
        </button>
        <button
          className={
            s.suggestions.viewMode === "list"
              ? styles.SuggestionCard_ViewToggle_Active
              : ""
          }
          onClick={() => (s.suggestions.viewMode = "list")}
          aria-label="List View"
          title="Toggle List"
        >
          <FaList />
        </button>
      </div>

      <div className={styles.SuggestionCard_FilterContainer}>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => (s.suggestions.filter = category)}
            className={
              s.suggestions.filter === category
                ? styles.SuggestionCard_Filter_Active
                : ""
            }
            aria-pressed={s.suggestions.filter === category}
          >
            {category}
            {category === "Favorites" &&
              (s.suggestions.favorites || []).length > 0 && (
                <span className={styles.SuggestionCard_Badge}>
                  {(s.suggestions.favorites || []).length}
                </span>
              )}
          </button>
        ))}
      </div>

      <div
        className={`${styles.SuggestionCard_Grid} ${s.suggestions.viewMode === "list" ? styles.SuggestionCard_Grid_List : ""}`}
      >
        {filteredTips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.SuggestionCard_NoResults}
          >
            <span style={{ fontSize: "2rem" }}>
              {s.suggestions.filter === "Favorites"
                ? "💔"
                : searchQuery
                  ? "🔎"
                  : "📋"}
            </span>
            <p>
              {s.suggestions.filter === "Favorites"
                ? "Your favorites list is empty"
                : searchQuery
                  ? `No results for "${searchQuery}"`
                  : `No ${s.suggestions.filter === "All" ? "suggestions" : s.suggestions.filter.toLowerCase() + " habits"} available`}
            </p>
            <small>
              {s.suggestions.filter === "Favorites"
                ? "Tap the ❤️ heart icon on any suggestion to save it here"
                : searchQuery
                  ? "Try checking your spelling or using different keywords"
                  : s.suggestions.filter !== "All"
                    ? `Browse other categories or check back soon for ${s.suggestions.filter.toLowerCase()} habits`
                    : "New suggestions are added regularly. Check back soon!"}
            </small>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredTips.map((tip) => (
              <AnimatedTipCard
                key={`${s.suggestions.filter}-${tip.id || tip.title}`}
                tip={tip}
                viewMode={s.suggestions.viewMode}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </>
  );
};

export default SuggestionCard;
