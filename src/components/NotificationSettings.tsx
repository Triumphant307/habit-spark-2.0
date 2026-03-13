"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaBellSlash, FaCheck, FaTimes } from "react-icons/fa";
import { notificationService } from "@/app/services/notificationService";
import styles from "./NotificationSettings.module.css";

export default function NotificationSettings() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (notificationService.isSupported()) {
      setPermission(Notification.permission);

      // Show prompt if user hasn't decided yet
      if (Notification.permission === "default") {
        setShowPrompt(true);
      }
    }
  }, []);

  // Lock body scroll when prompt is shown
  useEffect(() => {
    if (showPrompt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPrompt]);

  const handleEnableNotifications = async () => {
    const granted = await notificationService.requestPermission();
    setPermission(granted ? "granted" : "denied");
    setShowPrompt(false);

    if (granted) {
      // Show test notification
      notificationService.show({
        title: "🎉 Notifications Enabled!",
        body: "You'll now receive reminders for your habits",
        tag: "permission-granted",
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!notificationService.isSupported()) {
    return null;
  }

  return (
    <>
      {/* Compact status indicator */}
      <div className={styles.statusIndicator}>
        {permission === "granted" ? (
          <FaBell
            className={styles.iconEnabled}
            title="Notifications enabled"
          />
        ) : (
          <FaBellSlash
            className={styles.iconDisabled}
            title="Notifications disabled"
          />
        )}
      </div>

      {/* Permission prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            className={styles.promptOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.promptCard}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <button
                className={styles.closeBtn}
                onClick={handleDismiss}
                aria-label="Close"
              >
                <FaTimes />
              </button>

              <div className={styles.iconWrapper}>
                <FaBell className={styles.bellIcon} />
              </div>

              <h3 className={styles.title}>Enable Habit Reminders?</h3>

              <p className={styles.description}>
                Get notified at your chosen times to stay on track with your
                habits.
              </p>

              <ul className={styles.featureList}>
                <li>
                  <FaCheck /> Daily habit reminders
                </li>
                <li>
                  <FaCheck /> Streak milestone celebrations
                </li>
                <li>
                  <FaCheck /> Streak at-risk warnings
                </li>
              </ul>

              <div className={styles.actions}>
                <button
                  className={styles.enableBtn}
                  onClick={handleEnableNotifications}
                >
                  <FaBell /> Enable Notifications
                </button>
                <button className={styles.laterBtn} onClick={handleDismiss}>
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
