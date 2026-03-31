"use client";
import { motion, AnimatePresence } from "framer-motion";
import { getTipsByCategory } from "@/utils/getTipsByCatergory";
import styles from "@/Styles/Suggestion/SuggestionCard.module.css";
import Search from "@/components/Suggestion/Search";
import { ToastContainer, toast } from "react-toastify";
import AnimatedTipCard from "@/components/Suggestion/AnimatedTipCard";
import { FaThLarge, FaList } from "react-icons/fa";
import useLocalStorage from "@/Hooks/useLocalStorage";
import { useRipple } from "@/Hooks/useRipple";
import React, { useState, useRef } from "react";

export interface Tip {
  id?: string | number;
  title: string;
  category?: string; // matches data/tips.json
  icon?: string;
  history?: string[];
  [key: string]: unknown;
}

const SuggestionCard: React.FC = () => {
  const [filter, setFilter] = useLocalStorage<string>("habitFilter", "All");
  const [favorites, setFavorites] = useLocalStorage<Tip[]>(
    "habitFavorites",
    [],
  );

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useLocalStorage<"grid" | "list">(
    "viewMode",
    "grid",
  );

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
    filter === "Favorites"
      ? favorites.filter((tip) =>
          tip.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : getTipsByCategory(filter, favorites).filter((tip) =>
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
            viewMode === "grid" ? styles.SuggestionCard_ViewToggle_Active : ""
          }
          onClick={() => setViewMode("grid")}
          aria-label="Grid View"
          title="Toggle grid"
        >
          <FaThLarge />
        </button>
        <button
          className={
            viewMode === "list" ? styles.SuggestionCard_ViewToggle_Active : ""
          }
          onClick={() => setViewMode("list")}
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
            onClick={() => setFilter(category)}
            className={
              filter === category ? styles.SuggestionCard_Filter_Active : ""
            }
            aria-pressed={filter === category}
          >
            {category}
            {category === "Favorites" && favorites.length > 0 && (
              <span className={styles.SuggestionCard_Badge}>
                {favorites.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div
        className={`${styles.SuggestionCard_Grid} ${viewMode === "list" ? styles.SuggestionCard_Grid_List : ""}`}
      >
        {filteredTips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.SuggestionCard_NoResults}
          >
            <span style={{ fontSize: "2rem" }}>
              {filter === "Favorites" ? "💔" : searchQuery ? "🔎" : "📋"}
            </span>
            <p>
              {filter === "Favorites"
                ? "Your favorites list is empty"
                : searchQuery
                  ? `No results for "${searchQuery}"`
                  : `No ${filter === "All" ? "suggestions" : filter.toLowerCase() + " habits"} available`}
            </p>
            <small>
              {filter === "Favorites"
                ? "Tap the ❤️ heart icon on any suggestion to save it here"
                : searchQuery
                  ? "Try checking your spelling or using different keywords"
                  : filter !== "All"
                    ? `Browse other categories or check back soon for ${filter.toLowerCase()} habits`
                    : "New suggestions are added regularly. Check back soon!"}
            </small>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredTips.map((tip) => (
              <AnimatedTipCard
                key={`${filter}-${tip.id || tip.title}`}
                tip={tip}
                favorites={favorites}
                setFavorites={setFavorites}
                viewMode={viewMode}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </>
  );
};

export default SuggestionCard;
