"use client";
import { toaster } from "@t007/toast";

export const toast = toaster(
  {
    position: "bottom-left",
    hideProgressBar: false,
    // closeOnClick: true,
    pauseOnHover: true,
    dragToClose: true,
    maxToasts: 3,
    newestOnTop: true,
    animation: "slide",
    // closeButton: true,
  },
  "habit_spark_toast_",
);

export default toast;
