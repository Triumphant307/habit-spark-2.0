"use client";

import React from "react";
import styles from "@/Styles/Suggestion/Suggestion.module.css";
import SuggestionCard from "@/components/Suggestion/SuggestionCard";

const Suggestions = () => {
  return (
    <div className={styles.Suggestion_Container}>
      <header className={styles.Header_Section}>
        <h1 className={styles.Suggestion_Title}>Discover Your Next Habit</h1>
        <p className={styles.Suggestion_Subtitle}>
          Browse our curated collection of sparks to ignite your journey.
        </p>
      </header>

      <SuggestionCard />
    </div>
  );
};

export default Suggestions;
