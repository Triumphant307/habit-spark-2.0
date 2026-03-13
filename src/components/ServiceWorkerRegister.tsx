"use client";

import { useEffect } from "react";
import logger from "@/app/utils/logger";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      logger.info("Registering Service Worker...");

      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          logger.info("Service Worker registered", {
            scope: registration.scope,
          });

          // Check for updates
          registration.addEventListener("updatefound", () => {
            logger.info("Service Worker update found");
          });
        })
        .catch((error) => {
          logger.error("Service Worker registration failed", error);
        });
    } else {
      logger.warn("Service Worker not supported in this browser");
    }
  }, []);

  return null;
}
