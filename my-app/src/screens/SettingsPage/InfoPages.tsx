import React from "react";
import { ArrowLeft, MapPin, Save } from "lucide-react";

export const PrivacySection: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => (
  <div className="settings-detail">
    <div className="settings-detail-header">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={20} />
      </button>
      <h2>Privacy & Security</h2>
    </div>
    <div className="settings-form">
      <div className="form-group">
        <label>Location Sharing</label>
        <select>
          <option value="while_using">While Using App</option>
          <option value="always">Always</option>
          <option value="never">Never</option>
        </select>
      </div>
      <div className="info-box">
        <MapPin size={18} />
        <p>Location sharing helps us show you nearby bakeries.</p>
      </div>
      <button className="save-button" onClick={() => alert("Saved!")}>
        <Save size={18} /> Save Settings
      </button>
    </div>
  </div>
);

export const SupportSection: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => (
  <div className="settings-detail">
    <div className="settings-detail-header">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={20} />
      </button>
      <h2>Help & Support</h2>
    </div>
    <div className="support-content">
      <div className="support-item">
        <h3>Contact Support</h3>
        <p>Get help from our team</p>
      </div>
    </div>
  </div>
);

export const AboutSection: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="settings-detail">
    <div className="settings-detail-header">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={20} />
      </button>
      <h2>About</h2>
    </div>
    <div className="about-content">
      <div className="app-info">
        <h3>Bakery Finder</h3>
        <p className="version">Version 1.0.0</p>
      </div>
    </div>
  </div>
);
