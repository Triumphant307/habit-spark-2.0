"use client";

import React from "react";
import styles from "@/Styles/Auth/AuthForm.module.css";
import { LuMail, LuLock } from "react-icons/lu";
import AuthInput from "./UI/AuthInput";
import AuthButton from "./UI/AuthButton";

const LoginForm: React.FC = () => {
  return (
    <form className={styles.Auth_Form}>
      <header className={styles.Auth_FormHeader}>
        <h1 className={styles.Auth_FormTitle}>Welcome Back</h1>
        <p className={styles.Auth_FormSubtitle}>Please login to your account</p>
      </header>

      <div className={styles.Auth_FormGroup}>
        <AuthInput
          label="Email Address"
          type="email"
          icon={<LuMail />}
          required
        />

        <AuthInput
          label="Password"
          type="password"
          icon={<LuLock />}
          required
        />

        <AuthButton type="submit">Login</AuthButton>

        <footer className={styles.Auth_FormFooter}>
          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </footer>
      </div>
    </form>
  );
};

export default LoginForm;
