import React, { Suspense } from "react";
import AuthCard from "@/components/Auth/AuthCard";
import LoginForm from "@/components/Auth/LoginForm";
const LoginPage: React.FC = () => {
  return (
    <div style={{ width: "100%", maxWidth: "100%", display: "flex", justifyContent: "center" }}>
      <AuthCard>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </AuthCard>
    </div>
  );
};

export default LoginPage;
