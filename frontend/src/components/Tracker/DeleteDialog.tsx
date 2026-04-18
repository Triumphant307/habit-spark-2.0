"use client";

import React, { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/Styles/Tracker/DeleteDialog.module.css";
import Button from "@/components/UI/Button";
import { LuTriangleAlert, LuTrash2, LuX } from "react-icons/lu";

interface DeleteDialogProp {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProp> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
      document.body.style.overflow = "hidden";
    } else if (dialogRef.current) {
      dialogRef.current.close();
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.DeleteDialog_Container}
      onClose={onClose}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.DeleteDialog_Wrapper}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className={styles.Header}>
              <div className={styles.Warning_Icon}>
                <LuTriangleAlert />
              </div>
              <h2 className={styles.Title}>Delete Spark?</h2>
              <p className={styles.Subtitle}>
                This action cannot be undone. You will lose all streak progress
                for this habit.
              </p>
            </div>

            <div className={styles.Actions}>
              <Button variant="secondary" onClick={onClose}>
                Keep Habit
              </Button>
              <Button
                onClick={onConfirm}
                className={styles.Confirm_Button}
                showIcon
                icon={<LuTrash2 />}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
};

export default DeleteDialog;
