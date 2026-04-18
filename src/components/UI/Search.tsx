"use client";

import React, { useRef } from "react";
import styles from "@/Styles/UI/Search.module.css";
import { LuSearch, LuX } from "react-icons/lu";

interface SearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultRef?: React.RefObject<HTMLDivElement | null>;
  placeholder?: string;
}

const Search: React.FC<SearchProps> = ({
  searchQuery,
  setSearchQuery,
  resultRef,
  placeholder = "Search for a spark...",
}) => {
  const handleClear = () => setSearchQuery("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      inputRef?.current?.blur();

      if (typeof window !== "undefined" && resultRef?.current) {
        resultRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className={styles.SearchBar_Container}>
      <LuSearch className={styles.SearchBar_Icon} aria-hidden="true" />
      <input
        id="habit-search"
        name="habit-search"
        type="text"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={styles.SearchBar_Input}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search habits"
        autoComplete="off"
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className={styles.SearchBar_ClearButton}
          aria-label="Clear search"
        >
          <LuX title="clear" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default Search;
