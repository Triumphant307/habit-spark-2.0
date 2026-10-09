import React, { useRef } from "react";
import styles from "./NotificationModal.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useReactor } from "sia-reactor/adapters/react";
import { appStore } from "@/core/store/app";
import { toggleNotificationModal, markNotificationAsRead } from "@/core/store/user";
import { useOutsideClick } from "@t007/utils/hooks/react";
import { LuX, LuInfo, LuCircleCheck, LuTriangleAlert, LuSparkles } from "react-icons/lu";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const getIconForType = (type: string) => {
  switch (type) {
    case "info":
      return <LuInfo className={styles.Icon_Info} />;
    case "success":
      return <LuCircleCheck className={styles.Icon_Success} />;
    case "warning":
      return <LuTriangleAlert className={styles.Icon_Warning} />;
    case "update":
      return <LuSparkles className={styles.Icon_Update} />;
    default:
      return <LuInfo className={styles.Icon_Info} />;
  }
};

const NotificationModal: React.FC = () => {
  const s = useReactor(appStore);
  const isOpen = s.user.preferences.notificationModalOpen;
  const notifications = s.notifications || [];

  const modalRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(modalRef, {
    enabled: isOpen,
    onOutside: () => toggleNotificationModal(false),
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.Modal_Overlay}>
          <motion.div
            ref={modalRef}
            className={styles.Modal_Content}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className={styles.Modal_Header}>
              <h2>Notifications</h2>
              <button
                className={styles.Close_Button}
                onClick={() => toggleNotificationModal(false)}
                aria-label="Close Notifications"
              >
                <LuX />
              </button>
            </div>

            <div className={styles.Notification_List}>
              {notifications.length === 0 ? (
                <div className={styles.Empty_State}>
                  <p>No new notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`${styles.Notification_Item} ${!notification.isRead ? styles.Unread : ""}`}
                    onClick={() => {
                      if (!notification.isRead) {
                        markNotificationAsRead(notification.id);
                      }
                    }}
                  >
                    <div className={styles.Notification_Icon}>{getIconForType(notification.type)}</div>
                    <div className={styles.Notification_Body}>
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className={styles.Time}>{dayjs(notification.date).fromNow()}</span>
                    </div>
                    {!notification.isRead && <div className={styles.Unread_Dot} />}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
