"use client";

import React, { useState, useId } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import styles from "@/Styles/Auth/UI/AuthInput.module.css";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  error?: string;
}

const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon, type = "text", error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = useId();

    const isPassword = type === "password";
    const currentType = isPassword && showPassword ? "text" : type;

    return (
      <div className={styles.InputContainer}>
        <div className={styles.FloatingWrapper}>
          <input
            {...props}
            ref={ref}
            id={inputId}
            type={currentType}
            className={`${styles.InputField} ${error ? styles.InputError : ""} ${className || ""}`}
            placeholder=" "
          />

          <label htmlFor={inputId} className={styles.Label}>
            <span className={styles.Icon}>{icon}</span>
            {label}
          </label>

          {isPassword && (
            <button
              type="button"
              className={styles.PasswordToggle}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <LuEyeOff /> : <LuEye />}
            </button>
          )}
        </div>
        {error && <span className={styles.ErrorMessage}>{error}</span>}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
