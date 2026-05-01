"use client";

import React from "react";
import { Input as T007Input, InputProps as T007InputProps } from "@t007/input/react";
import "@t007/input/style.css";

export type InputProps = T007InputProps & {
  label: React.ReactNode;
  icon?: React.ReactNode;
};

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(({ label, icon, error, ...props }, ref) => {
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
InputComponent.displayName = "Input";


import dynamic from 'next/dynamic';
const Input = dynamic(() => Promise.resolve(InputComponent), { ssr: false });

export default Input;

export { useFormManager } from "@t007/input/react";