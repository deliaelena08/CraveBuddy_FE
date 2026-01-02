import React, { useState } from "react";
import { avatars } from "../../utils/AvatarList";
import { Save, Camera } from "lucide-react";
import "./EditProfileForm.css";
import { AvatarPicker } from "../../components/Modals/AvatarPicker";
import { DefaultAvatar } from "../../components/SignUp/DefaultAvatar";
import { InputField } from "../../components/Inputs/InputField";
import { SelectField } from "../../components/Inputs/SelectField";
import { Language } from "../../entities/user/Language";
import { useTranslation } from "react-i18next";
import { useNotificationSystem } from "../../utils/useNotificationSystem";

export interface ProfileData {
  username: string;
  location: string;
  language: Language;
  icon: string;
}

interface EditProfileFormProps {
  initialData: ProfileData;
  onSave: (data: ProfileData) => Promise<void> | void;
  isLoading?: boolean;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialData,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const { t, i18n } = useTranslation();

  const { notify } = useNotificationSystem();

  const cities = ["Cluj-Napoca", "București", "Timișoara", "Iași", "Constanța"];
  const languagesDisplay = ["English", "Română"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "language") {
      const selectedLanguage = value === "Română" ? Language.RO : Language.EN;
      const langCode = selectedLanguage === Language.RO ? "ro" : "en";

      i18n.changeLanguage(langCode);

      setFormData((prev) => ({ ...prev, language: selectedLanguage }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarSelect = (avatar: string) => {
    setFormData((prev) => ({ ...prev, icon: avatar }));
    setShowAvatarPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSave(formData);
      notify(t("profile_saved_success"), "success");
    } catch (error) {
      console.error("Profile save error:", error);
      notify(t("profile_saved_error"), "error");
    }
  };

  const getCurrentLanguageDisplay = () => {
    return formData.language === Language.RO ? "Română" : "English";
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

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="profile-avatar-container">
          <div
            className="avatar-wrapper"
            onClick={() => setShowAvatarPicker(true)}
          >
            {formData.icon ? (
              <img
                src={formData.icon}
                alt="Selected avatar"
                className="current-avatar"
              />
            ) : (
              <div className="default-avatar-wrapper">
                <DefaultAvatar />
              </div>
            )}
            <div className="avatar-edit-overlay">
              <Camera size={20} color="white" />
            </div>
          </div>
          <p className="avatar-hint">{t("select_avatar")}</p>
        </div>

        <div className="form-fields">
          <InputField
            label={t("username")}
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          <SelectField
            label={t("city")}
            name="location"
            value={formData.location}
            options={cities}
            onChange={handleChange}
          />

          <SelectField
            label={t("language_label")}
            name="language"
            value={getCurrentLanguageDisplay()}
            options={languagesDisplay}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="save-profile-btn" disabled={isLoading}>
          <Save size={18} />
          {isLoading ? t("saving") : t("save")}
        </button>
      </form>
    </>
  );
};
