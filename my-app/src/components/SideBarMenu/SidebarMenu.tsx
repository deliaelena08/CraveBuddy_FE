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
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import "./SidebarMenu.css";
import { userQueryApi } from "../../apis/userQueryApi";

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

  const handleLogout = async () => {
    try {
      const res = await logoutUser().unwrap();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log(res.message);
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
        <div
          className={`menu-item ${isActive("/chatbot") ? "active" : ""}`}
          title="Chatbot"
          onClick={() => navigate("/chatbot")}
        >
          <MessageOutlined className="icon" />
          <span className="label">Chatbot</span>
        </div>

        <div
          className={`menu-item ${isShowingFavourites ? "active" : ""}`}
          title="Favourites"
          onClick={onToggleFavourites}
        >
          {isShowingFavourites ? (
            <HeartFilled className="icon" />
          ) : (
            <HeartOutlined className="icon" />
          )}
          <span className="label">Favourites</span>
        </div>

        <div
          className="menu-item"
          title="Notification"
          onClick={onToggleNotifications}
        >
          <BellOutlined className="icon" />
          <span className="label">Notification</span>
        </div>

        <div
          className={`menu-item ${isActive("/settings") ? "active" : ""}`}
          title="Settings"
          onClick={() => navigate("/settings")}
        >
          <SettingOutlined className="icon" />
          <span className="label">Settings</span>
        </div>

        <div className="menu-item" title="Logout" onClick={handleLogout}>
          <LogoutOutlined className="icon" />
          <span className="label">Logout</span>
        </div>
      </div>
    </div>
  );
};
