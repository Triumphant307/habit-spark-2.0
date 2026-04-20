"use client";

import React from "react";
import { LuCheck } from "react-icons/lu";
import styles from "@/Styles/Auth/UI/AuthCheckbox.module.css";

interface AuthCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode;
}

const AuthCheckbox = React.forwardRef<HTMLInputElement, AuthCheckboxProps>(({ children, className, ...props }, ref) => {
  return (
    <label className={`${styles.CheckboxContainer} ${className || ""}`}>
      <input type="checkbox" className={styles.HiddenCheckbox} ref={ref} {...props} />
      <div className={styles.StyledCheckbox}>
        <LuCheck />
      </div>
      <span className={styles.LabelText}>{children}</span>
    </label>
  );
});

AuthCheckbox.displayName = "AuthCheckbox";

export default AuthCheckbox;
