import React from 'react';
import '../components/Welcome/Welcome.css';
import "../components/SignUp/SignUp.css";
import { SignUpForm } from '../components/SignUp/SignUpForm';

const SignUpPage: React.FC = () => {
  return (
    <section>
      <div className="content">
        <h1>Create an Account</h1>
        <SignUpForm />
      </div>
    </section>
  );
};

export default SignUpPage;
