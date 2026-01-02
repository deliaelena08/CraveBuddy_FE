import React, { useState } from "react";
import "./UserListPage.css";
import { SidebarMenu } from "../../components/SideBarMenu/SideBarMenu";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../apis/userQueryApi";
import { UserDto } from "../../entities/user/UserDTO";
import {
  User,
  Trash2,
  Edit2,
  ShieldAlert,
  ShieldCheck,
  Map,
  ArrowLeft,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Toaster } from "react-hot-toast";
import { useNotificationSystem } from "../../utils/useNotificationSystem";
import { EditUserModal } from "../../components/Modals/EditUSerModal";
import { getAvatarSrc } from "../../utils/AvatarList";
import { useNavigate } from "react-router-dom";

export const UserListPage: React.FC = () => {
  const { t } = useTranslation();
  const { notify } = useNotificationSystem();
  const navigate = useNavigate();
  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirm_delete_user"))) {
      try {
        await deleteUser(id).unwrap();
        notify(t("user_deleted_success"), "success");
      } catch (err) {
        console.error(err);
        notify(t("error_generic"), "error");
      }
    }
  };

  const handleEditClick = (user: UserDto) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (id: number, data: UserDto) => {
    try {
      await updateUser({ id, data }).unwrap();
      notify(t("user_updated_success"), "success");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      notify(t("error_generic"), "error");
    }
  };

  return (
    <div className="user-list-page">
      <Toaster position="top-center" />

      <div className="user-list-content">
        <div className="list-header-modern">
          <div className="header-text">
            <h1 className="page-title">{t("users_list")}</h1>
            <p className="page-subtitle">Manage all registered users</p>
          </div>

          <button
            className="back-btn-modern"
            onClick={() => navigate("/home-map")}
          >
            <ArrowLeft size={18} />
            <span>{t("back_to_map")}</span>
          </button>
        </div>

        {isLoading && <div className="loading-spinner"></div>}
        {error && <p className="error-text">{t("error_loading_users")}</p>}

        <div className="users-grid">
          {users.map((user) => {
            const avatarSrc = getAvatarSrc(user.icon);

            return (
              <div key={user.id} className="user-card">
                <div className="user-avatar-section">
                  <div className="avatar-circle">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="User Avatar"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <User size={30} color="#5d4037" />
                    )}
                  </div>
                </div>

                <div className="user-info-section">
                  <h3 className="user-name">{user.username || "Unknown"}</h3>

                  <div className="user-role-badge">
                    {user.role === "ADMIN" ? (
                      <>
                        <ShieldAlert size={14} /> ADMIN
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} /> USER
                      </>
                    )}
                  </div>

                  <p
                    className="user-detail"
                    style={{ fontSize: "0.75rem", color: "#a1887f" }}
                  >
                    {user.location || ""}
                  </p>
                </div>

                <div className="user-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => handleEditClick(user)}
                    title={t("edit")}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(user.id!)}
                    title={t("delete")}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};
