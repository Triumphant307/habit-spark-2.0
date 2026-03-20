import React from "react";
import AuthCard from "@/components/Auth/AuthCard";
import SignupForm from "@/components/Auth/SignupForm";

const SignupPage: React.FC = () => {
  return (
    <div>
      <AuthCard>
        <SignupForm />
      </AuthCard>
    </div>
  );
};

export default SignupPage;
