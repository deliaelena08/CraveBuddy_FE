import React, { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNotificationSystem } from "../../utils/useNotificationSystem";

interface PreferencesFormProps {
  onBack: () => void;
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({ onBack }) => {
  const { t, i18n } = useTranslation();
  const { notify } = useNotificationSystem();

  const [settings, setSettings] = useState({
    language: i18n.language.startsWith("ro") ? "ro" : "en",
    distanceUnit: "km",
    searchRadius: 10,
    notifications: true,
    emailNotif: true,
    pushNotif: false,
    showClosed: false,
  });

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      language: i18n.language.startsWith("ro") ? "ro" : "en",
    }));
  }, [i18n.language]);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);

    setSettings({ ...settings, language: newLang });
  };

  const handleSave = () => {
    console.log(settings);
    notify(t("saved_preferences"), "success");
  };

  return (
    <div className="settings-detail">
      <div className="settings-detail-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>{t("preferences")}</h2>
      </div>
      <div className="settings-form">
        <div className="form-group">
          <label>{t("language_label")}</label>
          <select value={settings.language} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="ro">Română</option>
          </select>
        </div>

        <div className="toggle-group">
          <div className="toggle-item">
            <span>{t("all_notifications")}</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleToggle("notifications")}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <button className="save-button" onClick={handleSave}>
          <Save size={18} />
          {t("save_preferences")}
        </button>
      </div>
    </div>
  );
};
