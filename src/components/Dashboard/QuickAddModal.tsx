"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/Styles/Dashboard/QuickAddModal.module.css";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { LuPlus, LuX, LuSmile } from "react-icons/lu";
import { FaExclamationCircle } from "react-icons/fa";
import { addHabit } from "@/core/state/habits";
import toast from "@/utils/toast";

const HABIT_PRESETS = [
  { title: "Drink Water", icon: "💧" },
  { title: "Read 10 Pages", icon: "📚" },
  { title: "Meditation", icon: "🧘" },
  { title: "Morning Walk", icon: "🚶" },
  { title: "Coding", icon: "💻" },
  { title: "No Sugar", icon: "🚫" },
  { title: "Workout", icon: "🏋️" },
];

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(30);
  const [icon, setIcon] = useState("");
  const [error, setError] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
      document.body.style.overflow = "hidden";
    } else if (dialogRef.current) {
      dialogRef.current.close();
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setTarget(30);
      setIcon("");
      setError("");
      setShowPicker(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    if (!icon) {
      setError("Please select an icon.");
      return;
    }

    addHabit({ title: trimmedTitle, icon, target });
    toast.success(`"${trimmedTitle}" spark ignited! ✨`);
    onClose();
  };

  return (
    <dialog ref={dialogRef} className={styles.QAModal_Container} onClose={onClose}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={styles.QAModal_Wrapper}
          >
            <div className={styles.Header}>
              <h2 className={styles.Title}>New Spark</h2>
              <button className={styles.Close_Button} onClick={onClose}>
                <LuX />
              </button>
            </div>

            {/* Quick Start Presets */}
            <div className={styles.Presets_Container}>
              <p className={styles.Presets_Label}>Quick Start</p>
              <div className={styles.Presets_List}>
                {HABIT_PRESETS.map((preset, idx) => (
                  <motion.button
                    key={preset.title}
                    type="button"
                    className={styles.Preset_Chip}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setTitle(preset.title);
                      setIcon(preset.icon);
                    }}
                  >
                    <span>{preset.icon}</span> {preset.title}
                  </motion.button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.Form}>
              <Input
                label="Habit Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError("");
                }}
                autoFocus
              />

              <Input
                label="Daily Target (Days)"
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                min={1}
                required
              />

              <div className={styles.Picker_Section}>
                <label className={styles.Picker_Label}>Visual Identity</label>
                <motion.button
                  type="button"
                  className={styles.Icon_Preview}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPicker(!showPicker)}
                >
                  <AnimatePresence mode="wait">
                    {icon ? (
                      <motion.span
                        key={icon}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={styles.Selected_Icon}
                      >
                        {icon}
                      </motion.span>
                    ) : (
                      <div className={styles.Placeholder_Icon}>
                        <LuSmile />
                        <span>Add Icon</span>
                      </div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {showPicker && (
                  <div className={styles.Emoji_Picker_Wrapper}>
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji: any) => {
                        setIcon(emoji.native);
                        setShowPicker(false);
                      }}
                      theme="dark"
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className={styles.Error_Banner}>
                  <FaExclamationCircle />
                  <span>{error}</span>
                </div>
              )}

              <div className={styles.Actions}>
                <Button variant="secondary" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" showIcon icon={<LuPlus />}>
                  Create Habit
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
};

export default QuickAddModal;
