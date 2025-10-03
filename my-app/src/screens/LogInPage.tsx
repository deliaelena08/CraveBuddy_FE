import React from "react";
import "../components/LogIn/LogIn.css";
import { LoginForm } from "../components/LogIn/LogInForm";

export const LoginPage: React.FC = () => {
  return (
    <section className="form-container">
      <div className="content">
        <h1>Login to your Account</h1>
        <LoginForm />
      </div>
    </section>
  );
};
