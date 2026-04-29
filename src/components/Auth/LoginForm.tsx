"use client";

import React from "react";
import styles from "@/Styles/Auth/AuthForm.module.css";
import { LuMail, LuLock } from "react-icons/lu";
import Input, { useFormManager } from "@/components/UI/Input";
import AuthButton from "./UI/AuthButton";
import SocialAuth from "./SocialAuth";
import AuthDivider from "./UI/AuthDivider";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormValues } from "@/utils/authValidation";
import { zodResolver as hookFormResolver } from "@hookform/resolvers/zod";

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: hookFormResolver(loginSchema), mode: "onBlur" });
  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form successfully submitted:", data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const { handleSubmit } = useFormManager((e) => rhfHandleSubmit(onSubmit)(e));

  return (
    <form noValidate className={styles.Auth_Form} onSubmit={handleSubmit}>
      <header className={styles.Auth_FormHeader}>
        <h1 className={styles.Auth_FormTitle}>Welcome Back</h1>
        <p className={styles.Auth_FormSubtitle}>Please login to your account</p>
      </header>

      <div className={styles.Auth_FormGroup}>
        <SocialAuth />
        <AuthDivider />

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

        <a href="/forgot-password" className={styles.Auth_ForgotPassword}>
          Forgot password?
        </a>

        <AuthButton type="submit" isLoading={isSubmitting}>
          Login
        </AuthButton>

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
