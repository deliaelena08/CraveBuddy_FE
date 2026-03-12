import React, { useState } from "react";
import { InputField } from "../Inputs/InputField";
import { SelectField } from "../Inputs/SelectField";
import { AvatarPicker } from "../Modals/AvatarPicker";
import { avatars } from "../../utils/AvatarList";
import { DefaultAvatar } from "./DefaultAvatar";
import { userQueryApi } from "../../apis/userQueryApi";
import { useNavigate } from "react-router-dom";
import { Language } from "../../entities/user/Language";
import { useNotificationSystem } from "../../utils/useNotificationSystem";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const { notify } = useNotificationSystem();

  const handleAvatarSelect = (avatar: string) => {
    setFormData((prev) => ({ ...prev, icon: avatar }));
    setShowAvatarPicker(false);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const result = await registerUser(formData).unwrap();
  //     localStorage.setItem("token", result.token);
  //     notify(
  //       `Welcome, ${result.username}! Account created successfully.`,
  //       "success"
  //     );
  //     console.log("Register result:", result);
  //     navigate("/home-map");
  //   } catch (err: any) {
  //     console.error("Register failed:", err);
  //     notify("Registration failed. Please try again.", "error");
  //   }
  // };
  // În SignUpForm.tsx

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Facem "traducerea" limbii.
    let mappedLanguage = Language.EN; // Valoarea default de siguranță

    // Verificăm ce e momentan în formData și convertim în enum-ul pe care îl așteaptă backend-ul
    if (
      formData.language === "Română" ||
      formData.language === "RO" ||
      formData.language === Language.RO
    ) {
      mappedLanguage = Language.RO;
    } else if (
      formData.language === "English" ||
      formData.language === "EN" ||
      formData.language === Language.EN
    ) {
      mappedLanguage = Language.EN;
    }

    // 2. Creăm obiectul final pe care îl vom trimite, folosind limba mapată
    const dataToSend = {
      ...formData,
      language: mappedLanguage,
    };

    try {
      // 3. Trimitem datele mapate, NU formData-ul brut
      const result = await registerUser(dataToSend).unwrap();

      localStorage.setItem("token", result.token);
      notify(
        `Welcome, ${result.username}! Account created successfully.`,
        "success",
      );
      console.log("Register result:", result);
      navigate("/home-map");
    } catch (err: any) {
      console.error("Register failed:", err);
      // E bine să afișăm eroarea exactă venită de la server dacă există, te ajută la debug!
      const errorMessage =
        err?.data?.error || "Registration failed. Please try again.";
      notify(errorMessage, "error");
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
