"use client";

import { motion, AnimatePresence } from "framer-motion";
import styles from "@/Styles/Suggestion/SuggestionCard.module.css";
import Search from "@/components/UI/Search";
import AnimatedTipCard from "@/components/Suggestion/AnimatedTipCard";
import { FaThLarge, FaList, FaSpinner } from "react-icons/fa";
import { useReactor } from "sia-reactor/adapters/react";
import { appStore } from "@/core/store/app";
import { fetchSuggestionsAction, fetchCategoriesAction } from "@/core/store/suggestions";
import React, { useState, useRef, useMemo, useEffect } from "react";

const SuggestionCard: React.FC = () => {
  const s = useReactor(appStore);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const resultRef = useRef(null);

  // Fetch categories on mount
  useEffect(() => {
    if (s.suggestions.categories.length <= 6) { // Only fetch if we just have the defaults
      fetchCategoriesAction();
    }
  }, [s.suggestions.categories.length]);

  // Fetch tips when filter or search changes (debounced)
  useEffect(() => {
    if (s.suggestions.filter === "Favorites") return;

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestionsAction(true, {
        category: s.suggestions.filter,
        q: searchQuery,
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, s.suggestions.filter]);

  // Optimization: Calculate once at the top level
  const favoriteCount = useMemo(() => (s.suggestions.favorites || []).length, [s.suggestions.favorites]);

  const filteredTips =
    s.suggestions.filter === "Favorites"
      ? (s.suggestions.favorites || []).filter((tip) => tip.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : s.suggestions.tips || [];

  const handleLoadMore = () => {
    if (!s.suggestions.isLoading && s.suggestions.hasMore) {
      fetchSuggestionsAction(false, {
        category: s.suggestions.filter,
        q: searchQuery,
      });
    }
  };

  return (
    <>
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} resultRef={resultRef} />
      <div className={styles.SuggestionCard_ViewToggle}>
        <button
          className={s.suggestions.viewMode === "grid" ? styles.SuggestionCard_ViewToggle_Active : ""}
          onClick={() => (s.suggestions.viewMode = "grid")}
          aria-label="Grid View"
          title="Toggle grid"
        >
          <FaThLarge />
        </button>
        <button
          className={s.suggestions.viewMode === "list" ? styles.SuggestionCard_ViewToggle_Active : ""}
          onClick={() => (s.suggestions.viewMode = "list")}
          aria-label="List View"
          title="Toggle List"
        >
          <FaList />
        </button>
      </div>

      <div className={styles.SuggestionCard_FilterContainer}>
        {s.suggestions.categories.map((category) => (
          <button
            key={category}
            type="button"
            title={`Filter by ${category}`}
            onClick={() => (s.suggestions.filter = category)}
            className={s.suggestions.filter === category ? styles.SuggestionCard_Filter_Active : ""}
            aria-pressed={s.suggestions.filter === category}
          >
            {category}
            {category === "Favorites" && favoriteCount > 0 && (
              <span className={styles.SuggestionCard_Badge}>{favoriteCount}</span>
            )}
          </button>
        ))}
      </div>

      {s.suggestions.isLoading && filteredTips.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <FaSpinner className="spin" size={30} />
        </div>
      ) : (
        <div
          className={`${styles.SuggestionCard_Grid} ${
            s.suggestions.viewMode === "list" ? styles.SuggestionCard_Grid_List : ""
          }`}
        >
          {filteredTips.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.SuggestionCard_NoResults}
            >
              <span style={{ fontSize: "2rem" }}>
                {s.suggestions.filter === "Favorites" ? "💔" : searchQuery ? "🔎" : "📋"}
              </span>
              <p>
                {s.suggestions.filter === "Favorites"
                  ? "Your favorites list is empty"
                  : searchQuery
                    ? `No results for "${searchQuery}"`
                    : `No ${
                        s.suggestions.filter === "All" ? "suggestions" : s.suggestions.filter.toLowerCase() + " habits"
                      } available`}
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
            <AnimatePresence initial={false}>
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
      )}

      {/* Load More Button */}
      {s.suggestions.filter !== "Favorites" && s.suggestions.hasMore && filteredTips.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <button 
            onClick={handleLoadMore}
            disabled={s.suggestions.isLoading}
            style={{
              padding: '0.8rem 2rem',
              borderRadius: '2rem',
              border: 'none',
              background: 'var(--primary)',
              color: 'white',
              cursor: s.suggestions.isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: s.suggestions.isLoading ? 0.7 : 1
            }}
          >
            {s.suggestions.isLoading ? <FaSpinner className="spin" /> : "Load More"}
          </button>
        </div>
      )}
    </>
  );
};

export default SuggestionCard;
