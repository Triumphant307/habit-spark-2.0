"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaTimes, FaDownload } from "react-icons/fa";
import { persistor } from "@/core/state/app";
import {
  APP_VERSION,
  REQUIRES_REINSTALL,
  REINSTALL_FROM_VERSION,
  REINSTALL_MESSAGE,
  WHATS_NEW,
} from "@/config/version";
import styles from "@/Styles/PWA/UpdatePrompt.module.css";

const VERSION_KEY = "habitspark_installed_version";
const DISMISSED_KEY = "habitspark_update_dismissed";

/**
 * Compare semantic versions with support for pre-release tags
 * @param v1 First version string (e.g., "1.0.0" or "1.0.0-beta")
 * @param v2 Second version string
 * @returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 * @throws Error if version format is invalid
 */
function compareVersions(v1: string, v2: string): number {
  // Remove 'v' prefix if present (e.g., "v1.0.0" -> "1.0.0")
  const clean1 = v1.replace(/^v/, "").split("-")[0];
  const clean2 = v2.replace(/^v/, "").split("-")[0];

  const parts1 = clean1.split(".").map(Number);
  const parts2 = clean2.split(".").map(Number);

  // Validate all parts are numbers
  if (parts1.some(isNaN) || parts2.some(isNaN)) {
    console.error(`Invalid version format: "${v1}" or "${v2}"`);
    // Return 0 to prevent errors, treat as equal
    return 0;
  }

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}

export default function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Check if localStorage is available
    if ("undefined" === typeof localStorage) {
      console.warn("localStorage not available, update prompt disabled");
      return;
    }

    // Check if running as installed PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    setIsPWA(isStandalone);

    // Only show for PWA users
    if (!isStandalone) return;

    const storedVersion = persistor.get<string>(VERSION_KEY);
    const dismissed = persistor.get<string>(DISMISSED_KEY);

    // First time install - save version
    if (!storedVersion) {
      persistor.set(VERSION_KEY, APP_VERSION);
      return;
    }

    // Check if update requires reinstall
    if (REQUIRES_REINSTALL) {
      const needsReinstall =
        compareVersions(storedVersion, REINSTALL_FROM_VERSION) < 0;

      // Don't show if already dismissed this version
      if (needsReinstall && dismissed !== APP_VERSION) {
        setShowPrompt(true);
      }
    }

    // Update stored version if newer
    if (compareVersions(APP_VERSION, storedVersion) > 0) {
      persistor.set(VERSION_KEY, APP_VERSION);
    }
  }, []);

  const handleDismiss = () => {
    persistor.set(DISMISSED_KEY, APP_VERSION);
    setShowPrompt(false);
  };

  const handleReinstall = async () => {
    try {
      // Clear service worker cache and unregister
      if ("serviceWorker" in navigator) {
        // Wait for all service workers to unregister
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map((registration) => registration.unregister()),
        );

        // Wait for all caches to be deleted
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // Clear version tracking (safe to do now)
      persistor.remove(VERSION_KEY);
      persistor.remove(DISMISSED_KEY);

      // Reload to trigger fresh install prompt
      window.location.reload();
    } catch (error) {
      console.error("Failed to reinstall app:", error);
      // Still try to reload even if cleanup failed
      window.location.reload();
    }
  };

  if (!showPrompt || !isPWA) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.UpdatePrompt_Overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={styles.UpdatePrompt_Card}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
        >
          <button
            type="button"
            title="Dismiss"
            className={styles.UpdatePrompt_CloseButton}
            onClick={handleDismiss}
          >
            <FaTimes />
          </button>

          <div className={styles.UpdatePrompt_IconWrapper}>
            <FaRocket className={styles.UpdatePrompt_Icon} />
          </div>

          <h2 className={styles.UpdatePrompt_Title}>Update Available! 🎉</h2>

          <p className={styles.UpdatePrompt_Message}>{REINSTALL_MESSAGE}</p>

          {WHATS_NEW.length > 0 && (
            <div className={styles.UpdatePrompt_Changes}>
              <h3>What's New:</h3>
              <ul>
                {WHATS_NEW.map((item, i) => (
                  <li key={i}>✨ {item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.UpdatePrompt_Actions}>
            <button
              className={styles.UpdatePrompt_UpdateButton}
              onClick={handleReinstall}
            >
              <FaDownload /> Reinstall App
            </button>
            <button
              className={styles.UpdatePrompt_LaterButton}
              onClick={handleDismiss}
            >
              Maybe Later
            </button>
          </div>

          <p className={styles.UpdatePrompt_Hint}>Version {APP_VERSION}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
