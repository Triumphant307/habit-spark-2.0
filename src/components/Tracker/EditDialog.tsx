"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/Styles/Tracker/EditDialog.module.css";
import Input, { useFormManager } from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { LuX, LuSave, LuSmile, LuType, LuTarget } from "react-icons/lu";
import { Habit } from "@/core/types/habit";
import { useArrowNavigation, useFocusTrap } from "@t007/utils/hooks/react";

interface EditDialogProps {
  isOpen: boolean;
  habit: Habit | null;
  onClose: () => void;
  onSave: (id: string, updatedFields: Partial<Habit>) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ isOpen, habit, onClose, onSave }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(30);
  const [icon, setIcon] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useFocusTrap(dialogRef, { enabled: isOpen });
  useArrowNavigation(dialogRef, { enabled: isOpen, rovingTab: false });

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setTarget(habit.target);
      setIcon(habit.icon);
    }
  }, [habit]);

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
    const handleClickOutside = (event: MouseEvent) =>
      pickerRef.current && !pickerRef.current.contains(event.target as Node) && setShowPicker(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  const { handleSubmit } = useFormManager((e: React.FormEvent) => {
    e.preventDefault();
    if (!habit) return;
    onSave(habit.id, { title, target: Number(target), icon });
    onClose();
  });

  return (
    <dialog ref={dialogRef} className={styles.EditDialog_Container} onClose={onClose} closedby="any">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.EditDialog_Wrapper}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className={styles.Header}>
              <h2 className={styles.Title}>Edit Spark</h2>
              <button className={styles.Close_Button} onClick={onClose}>
                <LuX />
              </button>
            </div>

            <form noValidate onSubmit={handleSubmit} className={styles.Form}>
              <Input
                label="Habit Title"
                icon={<LuType />}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                minLength={3}
                required
              />

              <Input
                label="Daily Target (Days)"
                type="number"
                icon={<LuTarget />}
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                min={1}
                required
              />

              <div className={styles.Picker_Section}>
                <label className={styles.Picker_Label}>Visual Identity</label>
                <button type="button" className={styles.Icon_Preview} onClick={() => setShowPicker(!showPicker)}>
                  <span className={styles.Selected_Icon}>{icon}</span>
                  <div className={styles.Icon_Overlay}>
                    <LuSmile />
                    <span>Change</span>
                  </div>
                </button>

                {showPicker && (
                  <div className={styles.Emoji_Picker_Wrapper} ref={pickerRef}>
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

              <div className={styles.Actions}>
                <Button data-autofocus data-arrow-item variant="secondary" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button data-arrow-item type="submit" showIcon icon={<LuSave />}>
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
};

export default EditDialog;
