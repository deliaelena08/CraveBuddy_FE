import React from "react";
import { ArrowLeft, MapPin, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNotificationSystem } from "../../utils/useNotificationSystem";

export const PrivacySection: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const { t } = useTranslation();
  const { notify } = useNotificationSystem();
  return (
    <div className="settings-detail">
      <div className="settings-detail-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>{t("privacy")}</h2>
      </div>
      <div className="settings-form">
        <div className="form-group">
          <label>{t("location_sharing")}</label>
          <select>
            <option value="while_using">{t("loc_while_using")}</option>
            <option value="always">{t("loc_always")}</option>
            <option value="never">{t("loc_never")}</option>
          </select>
        </div>
        <div className="info-box">
          <MapPin size={18} />
          <p>{t("loc_helper")}</p>
        </div>
        <button className="save-button" onClick={() => notify(t("save_info"))}>
          <Save size={18} /> {t("save")}
        </button>
      </div>
    </div>
  );
};

export const SupportSection: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const { t } = useTranslation();

  return (
    <div className="settings-detail">
      <div className="settings-detail-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>{t("help")}</h2>
      </div>
      <div className="support-content">
        <div className="support-item">
          <h3>{t("contact_support")}</h3>
          <p>{t("contact_support_desc")}</p>
        </div>
      </div>
    </div>
  );
};

export const AboutSection: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="settings-detail">
      <div className="settings-detail-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>{t("about")}</h2>
      </div>
      <div className="about-content">
        <div className="app-info">
          <h3>{t("app_name")}</h3>
          <p className="version">{t("version")} 1.0.0</p>
        </div>
      </div>
    </div>
  );
};
