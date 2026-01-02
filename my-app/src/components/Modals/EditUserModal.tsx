import React, { useState, useEffect } from "react";
import "./AddBakeryModal.css";
import { useTranslation } from "react-i18next";
import { UserDto } from "../../entities/user/UserDTO";
import { UserRole } from "../../entities/user/UserRole";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDto | null;
  onSave: (id: number, data: UserDto) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<UserDto>({
    id: 0,
    username: "",
    role: "USER",
    location: "",
    language: "RO",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || 0,
        username: user.username || "",
        role: user.role || "USER",
        location: user.location || "",
        language: user.language || "RO",
        password: user.password || "",
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = () => {
    onSave(user.id!, formData);
    onClose();
  };

  return (
    <div className="add-bakery-overlay">
      <div className="add-bakery-modal">
        <h3 className="add-bakery-title">{t("edit_user")}</h3>

        <div className="add-bakery-form">
          <label
            style={{ textAlign: "left", fontSize: "0.85rem", color: "#6d4c41" }}
          >
            Username
          </label>
          <input
            className="bakery-input"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />

          <label
            style={{
              textAlign: "left",
              fontSize: "0.85rem",
              color: "#6d4c41",
              marginTop: 10,
            }}
          >
            Role
          </label>
          <select
            className="bakery-input"
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role:
                  e.target.value.toLowerCase() == UserRole.ADMIN.toLowerCase()
                    ? UserRole.ADMIN
                    : UserRole.USER,
              })
            }
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div className="modal-actions">
          <button className="modal-btn cancel-btn" onClick={onClose}>
            {t("cancel")}
          </button>
          <button className="modal-btn save-btn" onClick={handleSubmit}>
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
};
