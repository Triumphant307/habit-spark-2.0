import React from "react";
import styles from "@/Styles/Auth/UI/AuthDivider.module.css";

const AuthDivider: React.FC<{ text?: string }> = ({ text = "or" }) => {
  return <div className={styles.Divider}>{text}</div>;
};

export default AuthDivider;
