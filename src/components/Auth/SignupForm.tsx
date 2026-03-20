"use client";

import React from "react";
import styles from "@/Styles/Auth/AuthForm.module.css";
import { LuMail, LuLock, LuUser } from "react-icons/lu";
import AuthInput from "./UI/AuthInput";
import AuthButton from "./UI/AuthButton";
import SocialAuth from "./SocialAuth";
import AuthDivider from "./UI/AuthDivider";
import AuthCheckbox from "./UI/AuthCheckbox";

const SignupForm: React.FC = () => {
  return (
    <form className={styles.Auth_Form}>
      <header className={styles.Auth_FormHeader}>
        <h1 className={styles.Auth_FormTitle}>Create Account</h1>
        <p className={styles.Auth_FormSubtitle}>Join HabitSpark today</p>
      </header>

      <div className={styles.Auth_FormGroup}>
        <SocialAuth />
        <AuthDivider />

        <AuthInput
          label="Full Name"
          type="text"
          icon={<LuUser />}
          required
        />

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

        <AuthInput
          label="Confirm Password"
          type="password"
          icon={<LuLock />}
          required
        />

        <AuthCheckbox required>
          I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
        </AuthCheckbox>

        <AuthButton type="submit">
          Sign Up
        </AuthButton>

        <footer className={styles.Auth_FormFooter}>
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </footer>
      </div>
    </form>
  );
};

export default SignupForm;
