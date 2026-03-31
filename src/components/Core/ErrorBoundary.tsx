"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaRedo, FaHome } from "react-icons/fa";
import logger from "@/utils/logger";
import styles from "@/Styles/Core/ErrorBoundary.module.css";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("React Error Boundary caught an error", error, {
      componentStack: errorInfo.componentStack,
    });

    this.setState({ errorInfo });

    // In production, send to error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    logger.info("User triggered error retry");
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.ErrorBoundary_Container}>
          <motion.div
            className={styles.ErrorBoundary_Card}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.ErrorBoundary_IconWrapper}>
              <FaExclamationTriangle className={styles.ErrorBoundary_Icon} />
            </div>

            <h1 className={styles.ErrorBoundary_Title}>Something went wrong</h1>

            <p className={styles.ErrorBoundary_Message}>
              We apologize for the inconvenience. An unexpected error occurred.
            </p>

            {process.env.NODE_ENV !== "production" && this.state.error && (
              <details className={styles.ErrorBoundary_Details}>
                <summary>Error Details (Dev Only)</summary>
                <pre className={styles.ErrorBoundary_ErrorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className={styles.ErrorBoundary_Actions}>
              <button
                className={`${styles.ErrorBoundary_Button} ${styles.ErrorBoundary_RetryButton}`}
                onClick={this.handleRetry}
              >
                <FaRedo /> Try Again
              </button>
              <button
                className={`${styles.ErrorBoundary_Button} ${styles.ErrorBoundary_HomeButton}`}
                onClick={this.handleGoHome}
              >
                <FaHome /> Go Home
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
