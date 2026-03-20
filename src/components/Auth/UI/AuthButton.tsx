"use client";

import React from "react";
import { LuArrowRight } from "react-icons/lu";
import styles from "@/Styles/Auth/UI/AuthButton.module.css";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  showIcon?: boolean;
}

const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
  (
    { children, isLoading = false, showIcon = true, className, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={`${styles.Auth_Button} ${className || ""}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className={styles.Spinner} />
        ) : (
          <>
            {children}
            {showIcon && <LuArrowRight className={styles.Icon} />}
          </>
        )}
      </button>
    );
  },
);

AuthButton.displayName = "AuthButton";

export default AuthButton;
