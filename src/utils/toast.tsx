"use client";
import { toast as toastify, ToastOptions } from "react-toastify";
import {
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";
import React from "react";

// Custom toast wrapper with premium icons
export const toast = {
  success: (message: React.ReactNode, options?: ToastOptions) =>
    toastify.success(message, {
      icon: <FaCheckCircle style={{ color: "#22c55e", fontSize: "1.25rem" }} />,
      ...options,
    }),

  error: (message: React.ReactNode, options?: ToastOptions) =>
    toastify.error(message, {
      icon: <FaTimesCircle style={{ color: "#ef4444", fontSize: "1.25rem" }} />,
      ...options,
    }),

  info: (message: React.ReactNode, options?: ToastOptions) =>
    toastify.info(message, {
      icon: <FaInfoCircle style={{ color: "#3b82f6", fontSize: "1.25rem" }} />,
      ...options,
    }),

  warning: (message: React.ReactNode, options?: ToastOptions) =>
    toastify.warning(message, {
      icon: (
        <FaExclamationTriangle
          style={{ color: "#f59e0b", fontSize: "1.25rem" }}
        />
      ),
      ...options,
    }),

  // Pass-through for other toast methods
  dismiss: toastify.dismiss,
  update: toastify.update,
  promise: toastify.promise,
  loading: toastify.loading,
};

export default toast;
