import React, { useState } from "react";
import { InputField } from "../Inputs/InputField";
import { toast } from "react-hot-toast";
import { userQueryApi } from "../../apis/userQueryApi";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = userQueryApi.useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginUser(formData).unwrap();
      localStorage.setItem("token", result.token);
      toast.success(`Welcome, ${result.username}! Login successful.`);
      navigate("/home-map");
    } catch (err: any) {
      console.error("Login failed:", err);
      toast.error(err?.data?.error || "Login failed. Please try again.");
    }
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
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
      <p className="login-hint">
        Don’t have an account?{" "}
        <a href="/signup" className="signup-link">
          Create one
        </a>
      </p>
    </form>
  );
};
