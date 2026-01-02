import React, { useState } from "react";
import {
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  BellOutlined,
  HeartOutlined,
  HeartFilled,
  TeamOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import "./SidebarMenu.css";
import { userQueryApi } from "../../apis/userQueryApi";
import { useTranslation } from "react-i18next";

interface SidebarMenuProps {
  onToggleFavourites?: () => void;
  isShowingFavourites?: boolean;
  onToggleNotifications?: () => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  onToggleFavourites,
  isShowingFavourites = false,
  onToggleNotifications,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [logoutUser] = userQueryApi.useLogoutUserMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>

      <div className="menu">
        {isAdmin ? (
          <>
            <div
              className={`menu-item ${
                isActive("/admin/users") ? "active" : ""
              }`}
              title={t("users_list")}
              onClick={() => navigate("/admin/users")}
            >
              <TeamOutlined className="icon" />
              <span className="label">{t("users_list")}</span>
            </div>
            <div
              className={`menu-item ${
                isActive("/admin/bakeries") ? "active" : ""
              }`}
              title={t("bakeries_list")}
              onClick={() => navigate("/admin/bakeries")}
            >
              <ShopOutlined className="icon" />
              <span className="label">{t("bakeries_list")}</span>
            </div>
            <div
              className={`menu-item ${isActive("/settings") ? "active" : ""}`}
              title={t("settings_title")}
              onClick={() => navigate("/settings")}
            >
              <SettingOutlined className="icon" />
              <span className="label">{t("settings_title")}</span>
            </div>
          </>
        ) : (
          <>
            <div
              className={`menu-item ${isActive("/chatbot") ? "active" : ""}`}
              title={t("chatbot")}
              onClick={() => navigate("/chatbot")}
            >
              <MessageOutlined className="icon" />
              <span className="label">{t("chatbot")}</span>
            </div>

            <div
              className={`menu-item ${isShowingFavourites ? "active" : ""}`}
              title={t("favourites")}
              onClick={onToggleFavourites}
            >
              {isShowingFavourites ? (
                <HeartFilled className="icon" />
              ) : (
                <HeartOutlined className="icon" />
              )}
              <span className="label">{t("favourites")}</span>
            </div>

            <div
              className="menu-item"
              title={t("notifications_title")}
              onClick={onToggleNotifications}
            >
              <BellOutlined className="icon" />
              <span className="label">{t("notifications_title")}</span>
            </div>

            <div
              className={`menu-item ${isActive("/settings") ? "active" : ""}`}
              title={t("settings_title")}
              onClick={() => navigate("/settings")}
            >
              <SettingOutlined className="icon" />
              <span className="label">{t("settings_title")}</span>
            </div>
          </>
        )}

        <div className="menu-item" title={t("logout")} onClick={handleLogout}>
          <LogoutOutlined className="icon" />
          <span className="label">{t("logout")}</span>
        </div>
      </div>
    </div>
  );
};
