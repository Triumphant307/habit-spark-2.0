"use client";

import React from "react";
import { LuArrowRight } from "react-icons/lu";
import styles from "@/Styles/UI/Button.module.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      isLoading = false,
      showIcon = false,
      icon,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={`${styles.Button} ${className || ""}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className={styles.Spinner} />
        ) : (
          <>
            {children}
            {showIcon && (icon || <LuArrowRight className={styles.Icon} />)}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
