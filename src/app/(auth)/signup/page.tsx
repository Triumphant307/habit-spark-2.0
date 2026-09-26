import React, { Suspense } from "react";
import AuthCard from "@/components/Auth/AuthCard";
import SignupForm from "@/components/Auth/SignupForm";

const SignupPage: React.FC = () => {
  return (
    <div>
      <AuthCard>
        <Suspense fallback={<div>Loading...</div>}>
          <SignupForm />
        </Suspense>
      </AuthCard>
    </div>
  );
};

export default SignupPage;
