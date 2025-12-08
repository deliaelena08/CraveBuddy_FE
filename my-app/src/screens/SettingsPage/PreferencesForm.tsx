import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

interface PreferencesFormProps {
  onBack: () => void;
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({ onBack }) => {
  const [settings, setSettings] = useState({
    language: "en",
    distanceUnit: "km",
    searchRadius: 10,
    notifications: true,
    emailNotif: true,
    pushNotif: false,
    showClosed: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-detail">
      <div className="settings-detail-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>Preferences</h2>
      </div>
      <div className="settings-form">
        <div className="form-group">
          <label>Language</label>
          <select
            value={settings.language}
            onChange={(e) =>
              setSettings({ ...settings, language: e.target.value })
            }
          >
            <option value="en">English</option>
            <option value="ro">Română</option>
          </select>
        </div>

        <div className="toggle-group">
          <div className="toggle-item">
            <span>All Notifications</span>
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

        <button
          className="save-button"
          onClick={() => {
            console.log(settings);
            alert("Saved!");
          }}
        >
          <Save size={18} />
          Save Preferences
        </button>
      </div>
    </div>
  );
};
