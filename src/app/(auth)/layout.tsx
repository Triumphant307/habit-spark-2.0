"use client";

import React from "react";
import styles from "@/Styles/Auth/Auth.module.css";
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={styles.Auth_Layout}>
      <div className={styles.Auth_Content}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </div>
    </main>
  );
}
