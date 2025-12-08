import React, { useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { InputField } from "../../components/Inputs/InputField";
interface ChangePasswordFormProps {
  onBack: () => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onBack,
}) => {
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
      alert("Passwords don't match!");
      return;
    }
    console.log("Change password logic here");
    alert("Password updated!");
    onBack();
  };

  return (
    <div className="settings-detail">
      <div className="settings-detail-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>Change Password</h2>
      </div>
      <div className="settings-form">
        <InputField
          label="Current Password"
          type="password"
          name="current"
          value={passwords.current}
          onChange={handleChange}
        />
        <InputField
          label="New Password"
          type="password"
          name="new"
          value={passwords.new}
          onChange={handleChange}
        />
        <InputField
          label="Confirm New Password"
          type="password"
          name="confirm"
          value={passwords.confirm}
          onChange={handleChange}
        />

        <button className="save-button" onClick={handleSubmit}>
          <Lock size={18} />
          Update Password
        </button>
      </div>
    </div>
  );
};
