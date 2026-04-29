"use client";

import React from "react";
import styles from "@/Styles/Auth/AuthForm.module.css";
import { LuMail, LuLock, LuUser } from "react-icons/lu";
import Input, { useFormManager } from "@/components/UI/Input";
import AuthButton from "./UI/AuthButton";
import SocialAuth from "./SocialAuth";
import AuthDivider from "./UI/AuthDivider";
import { useForm } from "react-hook-form";
import { signupSchema, type SignupFormValues } from "@/utils/authValidation";
import { zodResolver as hookFormResolver } from "@hookform/resolvers/zod";

const SignupForm: React.FC = () => {
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: hookFormResolver(signupSchema), mode: "onBlur" });
  const onSubmit = async (data: SignupFormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form successfully submitted:", data);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };
  const { handleSubmit } = useFormManager((e) => rhfHandleSubmit(onSubmit)(e));

  return (
    <form noValidate className={styles.Auth_Form} onSubmit={handleSubmit}>
      <header className={styles.Auth_FormHeader}>
        <h1 className={styles.Auth_FormTitle}>Create Account</h1>
        <p className={styles.Auth_FormSubtitle}>Join HabitSpark today</p>
      </header>

      <div className={styles.Auth_FormGroup}>
        <SocialAuth />
        <AuthDivider />

        <Input
          label="Full Name"
          type="text"
          icon={<LuUser />}
          {...register("fullName")}
          required
          minLength={2}
          error={errors.fullName?.message}
        />

        <Input
          label="Email Address"
          type="email"
          icon={<LuMail />}
          {...register("email")}
          required
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          icon={<LuLock />}
          {...register("password")}
          required
          minLength={8}
          error={errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          icon={<LuLock />}
          {...register("confirmPassword")}
          required
          minLength={8}
          passwordMeter={false}
          error={errors.confirmPassword?.message}
        />

        <div className={styles.Auth_CheckboxWrapper}>
          <Input
            type="checkbox"
            label={
              <>
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </>
            }
            {...register("terms")}
            error={errors.terms?.message}
          />
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
