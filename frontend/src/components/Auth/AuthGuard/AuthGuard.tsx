"use client";

import React, { useEffect, useRef } from "react";
import { useReactor } from "sia-reactor/adapters/react";
import { appStore } from "@/core/store/app";
import { checkAuthAction } from "@/core/store/auth";

/**
 * Client-side auth guard component.
 *
 * On mount, triggers checkAuthAction to verify the current session by
 * refreshing the access token and fetching the user profile. Renders a
 * loading state while the auth check is in progress.
 *
 * This component wraps the entire app layout so every page has access
 * to resolved auth state.
 */

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const s = useReactor(appStore);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only run the auth check once on initial mount
    if (!hasChecked.current) {
      hasChecked.current = true;
      checkAuthAction();
    }
  }, []);

  // Show a minimal loading state while verifying the session
  if (s.auth.isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            border: "3px solid rgba(200, 152, 88, 0.2)",
            borderTopColor: "var(--color-brand-primary)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
