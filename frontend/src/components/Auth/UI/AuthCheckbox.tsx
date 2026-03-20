"use client";

import React from "react";
import { LuCheck } from "react-icons/lu";
import styles from "@/Styles/Auth/UI/AuthCheckbox.module.css";

interface AuthCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode;
}

const AuthCheckbox: React.FC<AuthCheckboxProps> = ({ children, className, ...props }) => {
  return (
    <label className={`${styles.CheckboxContainer} ${className || ""}`}>
      <input type="checkbox" className={styles.HiddenCheckbox} {...props} />
      <div className={styles.StyledCheckbox}>
        <LuCheck />
      </div>
      <span className={styles.LabelText}>{children}</span>
    </label>
  );
};

export default AuthCheckbox;
