import React, { useState } from "react";
import { InputField } from "../Inputs/InputField";
import { SelectField } from "../Inputs/SelectField";
import { AvatarPicker } from "../Modals/AvatarPicker";
import { avatars } from "../../utils/AvatarList";
import { DefaultAvatar } from "./DefaultAvatar";
import { toast } from "react-hot-toast";
import { userQueryApi } from "../../apis/userQueryApi";
import { useNavigate } from "react-router-dom";
import { Language } from "../../entities/user/Language";

export const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    language: Language.EN,
    location: "Cluj-Napoca",
    icon: "",
  });

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [registerUser, { isLoading }] = userQueryApi.useRegisterUserMutation();
  const navigate = useNavigate();
  const cities = ["Cluj-Napoca", "București", "Timișoara", "Iași", "Constanța"];
  const languages = ["English", "Română"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatar: string) => {
    setFormData((prev) => ({ ...prev, icon: avatar }));
    setShowAvatarPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await registerUser(formData).unwrap();
      localStorage.setItem("token", result.token);
      toast.success(
        `Welcome, ${result.username}! Account created successfully.`
      );
      console.log("Register result:", result);
      navigate("/home-map");
    } catch (err: any) {
      console.error("Register failed:", err);
      toast.error(err?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <>
      {showAvatarPicker && (
        <AvatarPicker
          avatars={avatars}
          onSelect={handleAvatarSelect}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="signup-form">
        <div
          className="avatar-display"
          onClick={() => setShowAvatarPicker(true)}
        >
          {formData.icon ? (
            <img
              src={formData.icon}
              alt="Selected avatar"
              className="selected-avatar"
            />
          ) : (
            <DefaultAvatar />
          )}
        </div>

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
        <SelectField
          label="Language"
          name="language"
          value={formData.language}
          options={languages}
          onChange={handleChange}
        />
        <SelectField
          label="City"
          name="location"
          value={formData.location}
          options={cities}
          onChange={handleChange}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Sign Up"}
        </button>

        <p className="signup-hint">
          Already have an account?{" "}
          <a href="/login" className="login-link">
            Log in
          </a>
        </p>
      </form>
    </>
  );
};
