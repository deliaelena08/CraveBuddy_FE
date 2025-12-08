import React from "react";
import {
  User,
  Lock,
  Globe,
  Bell,
  Shield,
  HelpCircle,
  Trash2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SettingsMenuProps {
  onNavigate: (section: any) => void;
  onDeleteAccount: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  onNavigate,
  onDeleteAccount,
}) => {
  const navigate = useNavigate();

  return (
    <div className="settings-menu">
      <div className="settings-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1>Settings</h1>
      </div>

      <div
        className="settings-profile-card"
        onClick={() => onNavigate("profile")}
      >
        <div className="settings-section">
          <h3>Account</h3>
          <button
            className="settings-item"
            onClick={() => onNavigate("profile")}
          >
            <div className="settings-item-left">
              <User size={20} />
              <span>Edit Profile Details</span>
            </div>
            <ChevronRight size={18} />
          </button>
          <button
            className="settings-item"
            onClick={() => onNavigate("password")}
          >
            <div className="settings-item-left">
              <Lock size={20} />
              <span>Change Password</span>
            </div>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="settings-section">
          <h3>App Settings</h3>
          <button
            className="settings-item"
            onClick={() => onNavigate("preferences")}
          >
            <div className="settings-item-left">
              <Globe size={20} />
              <span>Preferences</span>
            </div>
            <ChevronRight size={18} />
          </button>
          <button
            className="settings-item"
            onClick={() => onNavigate("privacy")}
          >
            <div className="settings-item-left">
              <Shield size={20} />
              <span>Privacy & Security</span>
            </div>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="settings-section">
          <h3>Support</h3>
          <button
            className="settings-item"
            onClick={() => onNavigate("support")}
          >
            <div className="settings-item-left">
              <HelpCircle size={20} />
              <span>Help & Support</span>
            </div>
            <ChevronRight size={18} />
          </button>
          <button className="settings-item" onClick={() => onNavigate("about")}>
            <div className="settings-item-left">
              <Bell size={20} />
              <span>About</span>
            </div>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="settings-section danger-zone">
          <button className="settings-item danger" onClick={onDeleteAccount}>
            <div className="settings-item-left">
              <Trash2 size={20} />
              <span>Delete Account</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
