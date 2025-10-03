import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

export const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <section>
      <div className="wave">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="content">
        <h1>Welcome to CraveBuddy</h1>
        <button onClick={handleGetStarted}>Get Started</button>
      </div>
    </section>
  );
};
