"use client";

import React from "react";
import Input, { InputProps } from "@/components/UI/Input";

/**
 * AuthInput is now a wrapper/alias for the generic Input component.
 * This ensures backward compatibility while promoting the use of the
 * generic Input component throughout the app.
 */
const AuthInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <Input ref={ref} {...props} />;
  },
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
