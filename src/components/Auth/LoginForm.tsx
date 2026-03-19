"use client";

import React from "react";
import styles from "@/Styles/Auth/AuthForm.module.css";
import { LuMail, LuLock, LuArrowRight, LuEye, LuEyeOff } from "react-icons/lu";

const LoginForm: React.FC = () => {
  return (
    <form className={styles.Auth_Form}>
      <header className={styles.Auth_FormHeader}>
        <h1 className={styles.Auth_FormTitle}>Welcome Back</h1>
        <p className={styles.Auth_FormSubtitle}>Please login to your account</p>
      </header>
      <div className={styles.Auth_FormGroup}>
        <div className={styles.Auth_FormFieldWrapper}>
          <div className={styles.AuthForm_FloatingInput}>
            <input
              type="email"
              id="email"
              className={styles.Auth_FormInput}
              placeholder=""
            />

            <label htmlFor="email" className={styles.Auth_FormLabel}>
              <LuMail className={styles.Auth_FormIcon} />
              Email Address
            </label>
          </div>

          <div className={styles.Auth_FormFieldWrapper}>
            <div className={styles.AuthForm_FloatingInput}>
              <input
                type="password"
                id="password"
                className={styles.Auth_FormInput}
                placeholder=""
              />

              <label htmlFor="password" className={styles.Auth_FormLabel}>
                <LuLock className={styles.Auth_FormIcon} />
                Password
              </label>
            </div>
          </div>

          <button type="submit" className={styles.Auth_SubmitButton}>
            Login <LuArrowRight className={styles.Auth_FormButtonIcon} />
          </button>

          <footer className={styles.Auth_FormFooter}>
            <p>
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
          </footer>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
