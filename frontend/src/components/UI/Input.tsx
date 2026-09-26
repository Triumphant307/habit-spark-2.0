"use client";

import React from "react";
import { Input as T007Input, InputProps as T007InputProps } from "@t007/input/react";
import "@t007/input/style.css";

export type InputProps = T007InputProps & {
  label: React.ReactNode;
  icon?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, icon, error, ...props }, ref) => {
  return (
    <T007Input
      ref={ref}
      error={error}
      label={
        <>
          {icon} {label}
        </>
      }
      {...(props as T007InputProps)}
    />
  );
});
Input.displayName = "Input";

export default Input;

export { useFormManager } from "@t007/input/react";