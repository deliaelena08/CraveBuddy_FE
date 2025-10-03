import React from "react";
import "../components/SignUp/SignUp.css";
import { SignUpForm } from "../components/SignUp/SignUpForm";

export const SignUpPage: React.FC = () => {
  return (
    <section className="form-container">
      <div className="content">
        <h1>Create an Account</h1>
        <SignUpForm />
      </div>
    </section>
  );
};
