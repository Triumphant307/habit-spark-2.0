"use client";

import React from "react";
import Button, { ButtonProps } from "@/components/UI/Button";

/**
 * AuthButton is now a wrapper/alias for the generic Button component.
 * It defaults to showIcon={true} to match the original Auth styling.
 */
const AuthButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <Button ref={ref} showIcon={true} {...props} />;
  },
);

AuthButton.displayName = "AuthButton";

export default AuthButton;
