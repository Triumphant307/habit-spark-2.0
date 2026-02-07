"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaRedo, FaHome } from "react-icons/fa";
import logger from "@/app/utils/logger";
import styles from "@/app/Styles/ErrorBoundary.module.css";

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
        <div className={styles.container}>
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.iconWrapper}>
              <FaExclamationTriangle className={styles.icon} />
            </div>

            <h1 className={styles.title}>Something went wrong</h1>

            <p className={styles.message}>
              We apologize for the inconvenience. An unexpected error occurred.
            </p>

            {process.env.NODE_ENV !== "production" && this.state.error && (
              <details className={styles.details}>
                <summary>Error Details (Dev Only)</summary>
                <pre className={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className={styles.actions}>
              <button className={styles.retryBtn} onClick={this.handleRetry}>
                <FaRedo /> Try Again
              </button>
              <button className={styles.homeBtn} onClick={this.handleGoHome}>
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
