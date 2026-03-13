import Lottie from "lottie-react";
import animationData from "@/app/assets/lotties/Animation.json";
import React from "react";

const LottieAnimation : React.FC = () => {
  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default LottieAnimation;
