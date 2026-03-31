"use client";

import React from "react";
import styles from "@/Styles/Auth/AuthForm.module.css";
import { LuMail, LuLock, LuUser } from "react-icons/lu";
import AuthInput from "./UI/AuthInput";
import AuthButton from "./UI/AuthButton";
import SocialAuth from "./SocialAuth";
import AuthDivider from "./UI/AuthDivider";
import AuthCheckbox from "./UI/AuthCheckbox";
import { useForm } from "react-hook-form";
import { signupSchema, type SignupFormValues } from "@/utils/authValidation";
import { zodResolver as hookFormResolver } from "@hookform/resolvers/zod";

const SignupForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: hookFormResolver(signupSchema),
    mode: "onBlur", // Optional: Validation triggers when leaving field
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form successfully submitted:", data);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <form
      className={styles.Auth_Form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
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
          {...register("fullName")}
          error={errors.fullName?.message}
        />

        <AuthInput
          label="Email Address"
          type="email"
          icon={<LuMail />}
          {...register("email")}
          error={errors.email?.message}
        />

        <AuthInput
          label="Password"
          type="password"
          icon={<LuLock />}
          {...register("password")}
          error={errors.password?.message}
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          icon={<LuLock />}
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className={styles.Auth_CheckboxWrapper}>
          <AuthCheckbox {...register("terms")}>
            I agree to the <a href="/terms">Terms of Service</a> and{" "}
            <a href="/privacy">Privacy Policy</a>
          </AuthCheckbox>
          {errors.terms && (
            <p className={styles.Auth_CheckboxError}>{errors.terms.message}</p>
          )}
        </div>

        <AuthButton type="submit" isLoading={isSubmitting}>
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
