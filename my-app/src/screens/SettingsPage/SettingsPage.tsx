import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./SettingsPage.css";
import { useTranslation } from "react-i18next";
import { SettingsMenu } from "./SettingsMenu";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { PreferencesForm } from "./PreferencesForm";
import { EditProfileForm, ProfileData } from "./EditProfileForm";
import { PrivacySection, SupportSection, AboutSection } from "./InfoPages";
import { ArrowLeft } from "lucide-react";

import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../apis/userQueryApi";
import { UserDto } from "../../entities/user/UserDTO";
import { Language } from "../../entities/user/Language";
import { useNotificationSystem } from "../../utils/useNotificationSystem";

type SettingsSection =
  | "main"
  | "profile"
  | "password"
  | "preferences"
  | "privacy"
  | "support"
  | "about";

interface DecodedToken {
  userId: number;
  sub: string;
  exp: number;
}

export const SettingsPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<SettingsSection>("main");
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const { i18n, t } = useTranslation();
  const { notify } = useNotificationSystem();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserId(decoded.userId || (decoded as any).id);
      } catch (error) {
        console.error("Invalid token", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const {
    data: userData,
    isLoading,
    refetch,
  } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const goBack = () => setCurrentSection("main");

  useEffect(() => {
    if (userData?.language) {
      const backendLang = userData.language.toLowerCase();
      if (i18n.language !== backendLang) {
        i18n.changeLanguage(backendLang);
      }
    }
  }, [userData, i18n]);

  const handleSaveProfile = async (updatedData: ProfileData) => {
    if (!userId || !userData) return;

    try {
      const userDto: UserDto = {
        id: userId,
        username: updatedData.username,
        location: updatedData.location,
        language: updatedData.language,
        icon: updatedData.icon,
        role: userData.role,
        password: userData.password,
      };

      await updateUser({ id: userId, data: userDto }).unwrap();
      notify(t("profile_saved_success"), "success");
      refetch();
      goBack();
    } catch (error) {
      console.error("Update failed", error);
      notify(t("profile_saved_error"), "error");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(t("delete_account_confirm"))) {
      if (userId) {
        try {
          await deleteUser(userId).unwrap();
          localStorage.removeItem("token");
          notify(t("account_deleted_success"), "success");
          navigate("/login");
        } catch (error) {
          console.error("Delete failed", error);
          notify(t("account_delete_error"), "error");
        }
      }
    }
  };

  const profileInitialData: ProfileData = {
    username: userData?.username || "",
    location: userData?.location || "Cluj-Napoca",
    language: userData?.language || Language.EN,
    icon: userData?.icon || "",
  };

  if (isLoading) return <div className="p-4">Loading settings...</div>;

  switch (currentSection) {
    case "profile":
      return (
        <div className="settings-detail">
          <div className="settings-detail-header">
            <button className="back-button" onClick={goBack}>
              <ArrowLeft size={20} />
            </button>
            <h2>Edit Profile</h2>
          </div>
          <EditProfileForm
            initialData={profileInitialData}
            onSave={handleSaveProfile}
            isLoading={isUpdating}
          />
        </div>
      );

    case "password":
      return <ChangePasswordForm onBack={goBack} />;
    case "preferences":
      return <PreferencesForm onBack={goBack} />;
    case "privacy":
      return <PrivacySection onBack={goBack} />;
    case "support":
      return <SupportSection onBack={goBack} />;
    case "about":
      return <AboutSection onBack={goBack} />;
    case "main":
    default:
      return (
        <SettingsMenu
          onNavigate={setCurrentSection}
          onDeleteAccount={handleDeleteAccount}
          userProfile={{
            name: userData?.username || "",
            subtitle: userData?.location || "",
            icon: userData?.icon || "",
          }}
        />
      );
  }
};
