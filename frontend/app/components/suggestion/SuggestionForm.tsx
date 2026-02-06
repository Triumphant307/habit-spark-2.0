"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/Styles/Suggestion/SuggestionForm.module.css";
import { useRipple } from "@/app/Hooks/useRipple";
import { toast } from "react-toastify";
import { addHabitIntent } from "@/core/intent/habitIntents";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Link from "next/link";
import { FaSmile } from "react-icons/fa";

interface Emoji {
  native: string;
  [key: string]: unknown;
}

const SuggestionForm = () => {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [target, setTarget] = useState(30);
  const [error, setError] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const createRipple = useRipple();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  const handleEmojiSelect = (emoji: Emoji) => {
    setIcon(emoji.native); // Set the selected emoji as the icon
    setShowPicker(false); // Optionally close the picker
  };

  const handleAddHabit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate input fields
    // Ensure title, icon, and target are not empty or invalid
    if (title.trim() === "" || icon.trim() === "") {
      setError("Please enter a title and select an icon.");
      return;
    } else if (title.length < 3) {
      setError("Title must be at least 3 characters long.");
      return;
    } else if (icon.length < 1) {
      setError("Please select an icon.");
      return;
    } else if (target < 1) {
      setError("Target must be at least 1.");
      return;
    }

    // Uses Intent from the reactor core
    addHabitIntent({
      title: title.trim(),
      icon,
      target,
      streak: 0,
      history: [],
    });

    toast.dismiss();
    toast.success(
      <span>
        {`${title.trim()} ${icon} added to your habits!`}
        <Link
          href="/tracker"
          style={{ color: "#4caf50", textDecoration: "underline" }}
        >
          Go to Tracker
        </Link>
      </span>,
    );

    // Reset form fields after adding habit
    setTitle("");
    setIcon("");
    setTarget(30);
    setError("");
    setShowPicker(false);
  };

  return (
    <form onSubmit={handleAddHabit} className={styles.form}>
      <div className={styles.floatingInput}>
        <input
          id="habit-title"
          className={styles.TitleInput}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder=" "
        />
        <label htmlFor="habit-title">Habit Title</label>
      </div>

      <div className={styles.pickerContainer}>
        <label className={styles.inputLabel}>Habit Icon</label>
        <button
          className={styles.iconPreviewBtn}
          onPointerDown={(e) => createRipple(e)}
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          title={icon ? `Selected: ${icon}` : "Choose Habit Icon"}
          aria-label={
            icon
              ? `Selected emoji: ${icon}. Click to change`
              : "Choose an emoji icon for your habit"
          }
          aria-expanded={showPicker}
        >
          {icon ? (
            <span className={styles.selectedEmoji}>{icon}</span>
          ) : (
            <div className={styles.placeholderIcon}>
              <FaSmile />
              <small>Add Icon</small>
            </div>
          )}
        </button>
        {showPicker && (
          <div className={styles.pickerWrapper} ref={pickerRef}>
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </div>
        )}
      </div>

      <div className={styles.floatingInput}>
        <input
          id="habit-target"
          className={styles.TargetInput}
          type="number"
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          placeholder=" "
          aria-label="Habit target in days"
        />

        <label htmlFor="habit-target">Habit Target</label>
      </div>

      <button
        className={styles.btn}
        onPointerDown={(e) => createRipple(e)}
        type="submit"
        title="Add new Habits"
        aria-label="Add new habit to your tracker"
      >
        Add New Habit
      </button>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
    </form>
  );
};

export default SuggestionForm;
