import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "../../Styles/Tracker/DeleteDialog.module.css";

interface DeleteDialogProp {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const MotionDialog = motion.dialog;

const DeleteDialog: React.FC<DeleteDialogProp> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current?.showModal();
      document.body.style.overflow = "hidden";
    } else if (dialogRef.current) {
      dialogRef.current.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionDialog
          className={styles.dialog}
          ref={dialogRef}
          onClose={onClose}
          onCancel={onClose}
          initial={{ opacity: 0, scale: 0.8, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <h2>Delete Habit</h2>
          <p>
            Are you sure you want to delete this habit? This action cannot be
            undone.
          </p>
          <div className={styles.dialogActions}>
            <button
              onClick={onClose}
              className={styles.cancelBtn}
              title="Cancel habit"
            >
              Cancel
            </button>
            <button
              className={styles.deleteBtn}
              onClick={onConfirm}
              title="Delete habit"
            >
              Delete
            </button>
          </div>
        </MotionDialog>
      )}
    </AnimatePresence>
  );
};

export default DeleteDialog;
