import React from "react";
import styles from "@/Styles/Auth/Auth.module.css";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";

interface AuthCardProps {
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return (
    <div className={styles.Auth_Card}>
      <header className={styles.Auth_Header}>
        <Link href="/" className={styles.Auth_Logo}>
          <h1 className={styles.Auth_Logo_Text}>
            Habit<span className={styles.Auth_Logo_Spark}>Spark</span>
          </h1>
        </Link>
      </header>
      {children}
      <div className={styles.Auth_Footer}>
        <Link href="/">
          <LuArrowLeft /> Back to home
        </Link>
      </div>
    </div>
  );
};

export default AuthCard;
