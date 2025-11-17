import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Globe,
  Bell,
  Shield,
  MapPin,
  HelpCircle,
  Trash2,
  ChevronRight,
  Save,
  ArrowLeft,
} from "lucide-react";
import "./SettingsPage.css";

type SettingsSection =
  | "main"
  | "profile"
  | "password"
  | "preferences"
  | "privacy"
  | "support"
  | "about";

export const SettingsPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<SettingsSection>("main");
  const navigate = useNavigate();

  // Profile states
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+40 123 456 789");

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Preferences states
  const [language, setLanguage] = useState<"en" | "ro">("en");
  const [distanceUnit, setDistanceUnit] = useState<"km" | "miles">("km");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [showClosedBakeries, setShowClosedBakeries] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10);

  // Privacy states
  const [locationSharing, setLocationSharing] = useState<
    "always" | "while_using" | "never"
  >("while_using");

  const handleSaveProfile = () => {
    console.log("Saving profile:", { fullName, email, phone });
    alert("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }
    console.log("Changing password");
    alert("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSavePreferences = () => {
    console.log("Saving preferences:", {
      language,
      distanceUnit,
      notificationsEnabled,
      emailNotifications,
      pushNotifications,
      showClosedBakeries,
      searchRadius,
    });
    alert("Preferences saved successfully!");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      console.log("Deleting account");
      alert("Account deleted");
      navigate("/");
    }
  };

  const renderMainMenu = () => (
    <div className="settings-menu">
      <div className="settings-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1>Settings</h1>
      </div>
      <div className="settings-section">
        <h3>Account</h3>
        <button
          className="settings-item"
          onClick={() => setCurrentSection("profile")}
        >
          <div className="settings-item-left">
            <User size={20} />
            <span>Profile</span>
          </div>
          <ChevronRight size={18} />
        </button>
        <button
          className="settings-item"
          onClick={() => setCurrentSection("password")}
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
          onClick={() => setCurrentSection("preferences")}
        >
          <div className="settings-item-left">
            <Globe size={20} />
            <span>Preferences</span>
          </div>
          <ChevronRight size={18} />
        </button>
        <button
          className="settings-item"
          onClick={() => setCurrentSection("privacy")}
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
          onClick={() => setCurrentSection("support")}
        >
          <div className="settings-item-left">
            <HelpCircle size={20} />
            <span>Help & Support</span>
          </div>
          <ChevronRight size={18} />
        </button>
        <button
          className="settings-item"
          onClick={() => setCurrentSection("about")}
        >
          <div className="settings-item-left">
            <Bell size={20} />
            <span>About</span>
          </div>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="settings-section danger-zone">
        <button className="settings-item danger" onClick={handleDeleteAccount}>
          <div className="settings-item-left">
            <Trash2 size={20} />
            <span>Delete Account</span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderProfileSection = () => (
    <div className="settings-detail">
      <div className="settings-detail-header">
        <button
          className="back-button"
          onClick={() => setCurrentSection("main")}
        >
          <ArrowLeft size={20} />
        </button>
        <h2>Edit Profile</h2>
      </div>
      <div className="settings-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
        <button className="save-button" onClick={handleSaveProfile}>
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderPasswordSection = () => (
    <div className="settings-detail">
      <div className="settings-detail-header">
        <button
          className="back-button"
          onClick={() => setCurrentSection("main")}
        >
          <ArrowLeft size={20} />
        </button>
        <h2>Change Password</h2>
      </div>
      <div className="settings-form">
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
        <button className="save-button" onClick={handleChangePassword}>
          <Lock size={18} />
          Update Password
        </button>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="settings-detail">
      <div className="settings-detail-header">
        <button
          className="back-button"
          onClick={() => setCurrentSection("main")}
        >
          <ArrowLeft size={20} />
        </button>
        <h2>Preferences</h2>
      </div>
      <div className="settings-form">
        <div className="form-group">
          <label>Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "ro")}
          >
            <option value="en">English</option>
            <option value="ro">Română</option>
          </select>
        </div>
        <div className="form-group">
          <label>Distance Unit</label>
          <select
            value={distanceUnit}
            onChange={(e) => setDistanceUnit(e.target.value as "km" | "miles")}
          >
            <option value="km">Kilometers</option>
            <option value="miles">Miles</option>
          </select>
        </div>
        <div className="form-group">
          <label>Search Radius</label>
          <select
            value={searchRadius}
            onChange={(e) => setSearchRadius(Number(e.target.value))}
          >
            <option value={5}>5 {distanceUnit}</option>
            <option value={10}>10 {distanceUnit}</option>
            <option value={20}>20 {distanceUnit}</option>
            <option value={50}>50 {distanceUnit}</option>
          </select>
        </div>
        <div className="toggle-group">
          <div className="toggle-item">
            <span>All Notifications</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <span>Email Notifications</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <span>Push Notifications</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <span>Show Closed Bakeries</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={showClosedBakeries}
                onChange={(e) => setShowClosedBakeries(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        <button className="save-button" onClick={handleSavePreferences}>
          <Save size={18} />
          Save Preferences
        </button>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="settings-detail">
      <div className="settings-detail-header">
        <button
          className="back-button"
          onClick={() => setCurrentSection("main")}
        >
          <ArrowLeft size={20} />
        </button>
        <h2>Privacy & Security</h2>
      </div>
      <div className="settings-form">
        <div className="form-group">
          <label>Location Sharing</label>
          <select
            value={locationSharing}
            onChange={(e) =>
              setLocationSharing(
                e.target.value as "always" | "while_using" | "never"
              )
            }
          >
            <option value="always">Always</option>
            <option value="while_using">While Using App</option>
            <option value="never">Never</option>
          </select>
        </div>
        <div className="info-box">
          <MapPin size={18} />
          <p>
            Location sharing helps us show you nearby bakeries and provide
            accurate directions.
          </p>
        </div>
        <button
          className="save-button"
          onClick={() => alert("Privacy settings saved!")}
        >
          <Save size={18} />
          Save Settings
        </button>
      </div>
    </div>
  );

  const renderSupportSection = () => (
    <div className="settings-detail">
      <div className="settings-detail-header">
        <button
          className="back-button"
          onClick={() => setCurrentSection("main")}
        >
          <ArrowLeft size={20} />
        </button>
        <h2>Help & Support</h2>
      </div>
      <div className="support-content">
        <div className="support-item">
          <h3>FAQ</h3>
          <p>Find answers to commonly asked questions</p>
          <button className="link-button">View FAQ</button>
        </div>
        <div className="support-item">
          <h3>Contact Support</h3>
          <p>Get help from our support team</p>
          <button className="link-button">Contact Us</button>
        </div>
        <div className="support-item">
          <h3>Report an Issue</h3>
          <p>Let us know if something isn't working</p>
          <button className="link-button">Report Issue</button>
        </div>
      </div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="settings-detail">
      <div className="settings-detail-header">
        <button
          className="back-button"
          onClick={() => setCurrentSection("main")}
        >
          <ArrowLeft size={20} />
        </button>
        <h2>About</h2>
      </div>
      <div className="about-content">
        <div className="app-info">
          <h3>Bakery Finder</h3>
          <p className="version">Version 1.0.0</p>
          <p className="description">
            Discover the best bakeries in your area. Find fresh bread, pastries,
            cakes, and more from local bakeries near you.
          </p>
        </div>
        <div className="legal-links">
          <button className="link-button">Terms & Conditions</button>
          <button className="link-button">Privacy Policy</button>
          <button className="link-button">Licenses</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-page">
      {currentSection === "main" && renderMainMenu()}
      {currentSection === "profile" && renderProfileSection()}
      {currentSection === "password" && renderPasswordSection()}
      {currentSection === "preferences" && renderPreferencesSection()}
      {currentSection === "privacy" && renderPrivacySection()}
      {currentSection === "support" && renderSupportSection()}
      {currentSection === "about" && renderAboutSection()}
    </div>
  );
};
