import React, { useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { InputField } from "../../components/Inputs/InputField";
import { useTranslation } from "react-i18next";

interface ChangePasswordFormProps {
  onBack: () => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onBack,
}) => {
  const { t } = useTranslation();

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (passwords.new !== passwords.confirm) {
      alert(t("passwords_no_match"));
      return;
    }
    console.log("Change password logic here");
    alert(t("password_updated_success"));
    onBack();
  };

  return (
    <div className="settings-detail">
      <div className="settings-detail-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>{t("change_password")}</h2>
      </div>
      <div className="settings-form">
        <InputField
          label={t("current_password")}
          type="password"
          name="current"
          value={passwords.current}
          onChange={handleChange}
        />
        <InputField
          label={t("new_password")}
          type="password"
          name="new"
          value={passwords.new}
          onChange={handleChange}
        />
        <InputField
          label={t("confirm_new_password")}
          type="password"
          name="confirm"
          value={passwords.confirm}
          onChange={handleChange}
        />

        <button className="save-button" onClick={handleSubmit}>
          <Lock size={18} />
          {t("update_password_btn")}
        </button>
      </div>
    </div>
  );
};
