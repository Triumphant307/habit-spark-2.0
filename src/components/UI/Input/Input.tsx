"use client";

import React from "react";
import { Input as T007Input, InputProps as T007InputProps } from "@t007/input/react";
import "@t007/input/style.css";

export type InputProps = T007InputProps & {
  label: React.ReactNode;
  icon?: React.ReactNode;
  passwordMeter?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, passwordMeter = false, ...props }, ref) => {
    return (
      <T007Input
        ref={ref}
        error={error}
        // @ts-expect-error: passwordMeter exists in JS but is missing from typings
        passwordMeter={passwordMeter}
        label={
          <>
            {icon} {label}
          </>
        }
        {...(props as T007InputProps)}
      />
    );
  },
);
Input.displayName = "Input";

export default Input;

export { useFormManager } from "@t007/input/react";
