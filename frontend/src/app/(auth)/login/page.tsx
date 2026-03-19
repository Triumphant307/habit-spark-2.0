import React from "react";
import AuthCard from "@/components/Auth/AuthCard";
import LoginForm from "@/components/Auth/LoginForm";
const LoginPage: React.FC = () => {
  return (
    <div>
      <AuthCard>
        <LoginForm />
      </AuthCard>
    </div>
  );
};

export default LoginPage;
