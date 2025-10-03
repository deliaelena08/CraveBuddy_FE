import React, { useState } from "react";
import { InputField } from "../Inputs/InputField";
import { SelectField } from "../Inputs/SelectField";
import { AvatarPicker } from "../Modals/AvatarPicker";
import { avatars } from "../../utils/AvatarList";
import { DefaultAvatar } from "./DefaultAvatar";

export const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    language: "",
    city: "",
    avatar: "",
  });

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const cities = ["Cluj-Napoca", "București", "Timișoara", "Iași", "Constanța"];
  const languages = ["English", "Română"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatar: string) => {
    setFormData((prev) => ({ ...prev, avatar }));
    setShowAvatarPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", formData);
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
          {formData.avatar ? (
            <img
              src={formData.avatar}
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
          name="city"
          value={formData.city}
          options={cities}
          onChange={handleChange}
        />
        <button type="submit">Sign Up</button>
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
