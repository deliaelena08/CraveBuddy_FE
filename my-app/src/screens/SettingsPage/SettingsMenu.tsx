import React from "react";
import { useTranslation } from "react-i18next";
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
// Asigură-te că imporți componenta DefaultAvatar sau o imagine
import { DefaultAvatar } from "../../components/SignUp/DefaultAvatar";

interface SettingsMenuProps {
  onNavigate: (section: any) => void;
  onDeleteAccount: () => void;
  // Adăugăm prop-ul pentru datele utilizatorului ca să putem afișa cardul corect
  userProfile?: { name: string; subtitle: string; icon: string };
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  onNavigate,
  onDeleteAccount,
  userProfile,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="settings-menu">
      <div className="settings-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1>{t("settings_title")}</h1>
      </div>

      {/* --- 1. CARDUL DE PROFIL (CLICKABLE) --- */}
      {/* Acesta este doar header-ul cu poza. Îl închidem imediat după conținut. */}
      <div
        className="settings-profile-card"
        onClick={() => onNavigate("profile")}
        style={{ cursor: "pointer", marginBottom: "2rem" }} // Stiluri inline temporare sau CSS
      >
        {/* Aici ar trebui să fie conținutul vizual al cardului (Avatar + Nume) */}
        <div className="mini-avatar">
          {userProfile?.icon ? (
            <img src={userProfile.icon} alt="avatar" />
          ) : (
            <DefaultAvatar />
          )}
        </div>
        <div className="profile-info">
          <h3>{userProfile?.name || "User"}</h3>
          <p>{userProfile?.subtitle || "Location"}</p>
        </div>
      </div>
      {/* 🛑 AICI SE ÎNCHIDE CARDUL DE PROFIL! 🛑 
          Orice pui mai jos NU va mai declanșa navigarea la profil. */}

      {/* --- 2. RESTUL BUTOANELOR (SEPARATE) --- */}

      {/* Secțiunea CONT */}
      <div className="settings-section">
        <h3>{t("account")}</h3>

        <button className="settings-item" onClick={() => onNavigate("profile")}>
          <div className="settings-item-left">
            <User size={20} />
            <span>{t("edit_profile")}</span>
          </div>
          <ChevronRight size={18} />
        </button>

        <button
          className="settings-item"
          onClick={() => onNavigate("password")}
        >
          <div className="settings-item-left">
            <Lock size={20} />
            <span>{t("change_password")}</span>
          </div>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Secțiunea SETĂRI APLICAȚIE */}
      <div className="settings-section">
        <h3>{t("app_settings")}</h3>
        <button
          className="settings-item"
          onClick={() => onNavigate("preferences")}
        >
          <div className="settings-item-left">
            <Globe size={20} />
            <span>{t("preferences")}</span>
          </div>
          <ChevronRight size={18} />
        </button>
        <button className="settings-item" onClick={() => onNavigate("privacy")}>
          <div className="settings-item-left">
            <Shield size={20} />
            <span>{t("privacy")}</span>
          </div>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Secțiunea SUPORT */}
      <div className="settings-section">
        <h3>{t("support")}</h3>
        <button className="settings-item" onClick={() => onNavigate("support")}>
          <div className="settings-item-left">
            <HelpCircle size={20} />
            <span>{t("help")}</span>
          </div>
          <ChevronRight size={18} />
        </button>
        <button className="settings-item" onClick={() => onNavigate("about")}>
          <div className="settings-item-left">
            <Bell size={20} />
            <span>{t("about")}</span>
          </div>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Zona PERICOL */}
      <div className="settings-section danger-zone">
        <button className="settings-item danger" onClick={onDeleteAccount}>
          <div className="settings-item-left">
            <Trash2 size={20} />
            <span>{t("delete_account")}</span>
          </div>
        </button>
      </div>
    </div>
  );
};
