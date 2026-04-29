"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useRef } from "react";
import { LuMoveVertical, LuPencil, LuTrash2 } from "react-icons/lu";
import { useArrowNavigation, useOutsideClick } from "@t007/utils/hooks/react";
import style from "@/Styles/Tracker/TrackerCard.module.css";

interface TrackerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TrackerMenu: React.FC<TrackerMenuProps> = ({ isOpen, onToggle, onClose, onEdit, onDelete }) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(menuRef, { enabled: isOpen, onOutsideClick: onClose });
  useArrowNavigation(menuRef, { enabled: isOpen, typeahead: true });

  return (
    <div className={style.Menu_Wrapper} ref={menuRef}>
      <button
        className={style.More_Button}
        onClick={onToggle}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        aria-label="More options"
        aria-haspopup="menu"
      >
        <LuMoveVertical />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={style.Dropdown_Menu}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            role="menu"
          >
            <button
              data-arrow-item
              onClick={() => {
                console.log("Edit clicked");
                onEdit();
                onClose();
              }}
            >
              <LuPencil size={14} /> Edit Spark
            </button>
            <button
              data-arrow-item
              className={style.Delete_Option}
              onClick={() => {
                console.log("Delete clicked");
                onDelete();
                onClose();
              }}
            >
              <LuTrash2 size={14} /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrackerMenu;
