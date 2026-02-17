"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaTimes, FaDownload } from "react-icons/fa";
import {
  APP_VERSION,
  REQUIRES_REINSTALL,
  REINSTALL_FROM_VERSION,
  REINSTALL_MESSAGE,
  WHATS_NEW,
} from "@/app/config/version";
import styles from "@/app/Styles/UpdatePrompt.module.css";
import { safeLocalStorage } from "@/app/utils/safeLocalStorage";

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
    if (!safeLocalStorage.isAvailable()) {
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

    const storedVersion = safeLocalStorage.getItem(VERSION_KEY);
    const dismissed = safeLocalStorage.getItem(DISMISSED_KEY);

    // First time install - save version
    if (!storedVersion) {
      safeLocalStorage.setItem(VERSION_KEY, APP_VERSION);
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
      safeLocalStorage.setItem(VERSION_KEY, APP_VERSION);
    }
  }, []);

  const handleDismiss = () => {
    safeLocalStorage.setItem(DISMISSED_KEY, APP_VERSION);
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
      safeLocalStorage.removeItem(VERSION_KEY);
      safeLocalStorage.removeItem(DISMISSED_KEY);

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
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={styles.modal}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
        >
          <button className={styles.closeBtn} onClick={handleDismiss}>
            <FaTimes />
          </button>

          <div className={styles.iconWrapper}>
            <FaRocket className={styles.icon} />
          </div>

          <h2 className={styles.title}>Update Available! 🎉</h2>

          <p className={styles.message}>{REINSTALL_MESSAGE}</p>

          {WHATS_NEW.length > 0 && (
            <div className={styles.whatsNew}>
              <h3>What's New:</h3>
              <ul>
                {WHATS_NEW.map((item, i) => (
                  <li key={i}>✨ {item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.actions}>
            <button className={styles.reinstallBtn} onClick={handleReinstall}>
              <FaDownload /> Reinstall App
            </button>
            <button className={styles.laterBtn} onClick={handleDismiss}>
              Maybe Later
            </button>
          </div>

          <p className={styles.hint}>Version {APP_VERSION}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
