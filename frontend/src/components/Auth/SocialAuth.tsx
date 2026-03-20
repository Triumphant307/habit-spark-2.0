"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import styles from "@/Styles/Auth/SocialAuth.module.css";

const SocialAuth: React.FC = () => {
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Integrate with your Auth provider here (e.g., Firebase, NextAuth, etc.)
  };

  const handleGithubLogin = () => {
    console.log("GitHub login clicked");
  };

  return (
    <div className={styles.Social_Container}>
      <button 
        type="button" 
        className={styles.Social_Button} 
        onClick={handleGoogleLogin}
        aria-label="Continue with Google"
      >
        <FcGoogle className={styles.Social_Icon} />
        <span>Google</span>
      </button>

      <button 
        type="button" 
        className={styles.Social_Button} 
        onClick={handleGithubLogin}
        aria-label="Continue with GitHub"
      >
        <FaGithub className={styles.Social_Icon} />
        <span>GitHub</span>
      </button>
    </div>
  );
};

export default SocialAuth;
