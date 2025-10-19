import React, { useState } from "react";
import {
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  StarOutlined,
  BellOutlined,
} from "@ant-design/icons";
import "./SidebarMenu.css";
import { userQueryApi } from "../../apis/userQueryApi";

export const SidebarMenu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [logoutUser] = userQueryApi.useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      const res = await logoutUser().unwrap();
      localStorage.removeItem("token");
      console.log(res.message);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>

      <div className="menu">
        <div className="menu-item" title="Chatbot">
          <MessageOutlined className="icon" />
          <span className="label">Chatbot</span>
        </div>
        <div className="menu-item" title="Favourites">
          <StarOutlined className="icon" />
          <span className="label">Favourites</span>
        </div>
        <div className="menu-item" title="Notification">
          <BellOutlined className="icon" />
          <span className="label">Notification</span>
        </div>
        <div className="menu-item" title="Settings">
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
