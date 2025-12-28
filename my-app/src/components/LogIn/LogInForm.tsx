import React, { useState } from "react";
import { InputField } from "../Inputs/InputField";
import { userQueryApi } from "../../apis/userQueryApi";
import { useNavigate } from "react-router-dom";
import { useNotificationSystem } from "../../utils/useNotificationSystem";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { notify } = useNotificationSystem();
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = userQueryApi.useLoginUserMutation();
  const { i18n, t } = useTranslation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const result = await loginUser(formData).unwrap();

      localStorage.setItem("token", result.token);
      const userToSave = { id: result.id, username: result.username };
      localStorage.setItem("user", JSON.stringify(userToSave));
      if (result.language) {
        const lang = result.language.toLowerCase();
        i18n.changeLanguage(lang);
      }
      notify(t("welcome", { name: result.username }), "success");
      navigate("/home-map");
    } catch (err: any) {
      console.error("Login failed:", err);
      const message = err?.data?.message || "Invalid username or password";
      setErrorMessage(message);
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

      {errorMessage && (
        <div className="error-message">
          <AlertCircle size={16} />
          {errorMessage}
        </div>
      )}

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
