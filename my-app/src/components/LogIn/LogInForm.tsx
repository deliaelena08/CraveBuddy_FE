import React, { useState } from "react";
import { InputField } from "../Inputs/InputField";

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <InputField
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Login</button>
      <p className="login-hint">
        Don’t have an account?{" "}
        <a href="/signup" className="signup-link">
          Create one
        </a>
      </p>
    </form>
  );
};
