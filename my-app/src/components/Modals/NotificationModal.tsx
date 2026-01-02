import React from "react";
import "./NotificationModal.css";
import { NotificationDto } from "../../entities/notification/NotificationDto";
import { CloseOutlined, BellFilled, DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} from "../../apis/notificationQueryApi";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationDto[];
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
}) => {
  const { t, i18n } = useTranslation();

  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();

  const userStr = localStorage.getItem("user");
  const storedUser = userStr ? JSON.parse(userStr) : null;
  const userId = storedUser?.id;

  if (!isOpen) return null;

  const handleDeleteOne = async (id: number) => {
    try {
      await deleteNotification(id).unwrap();
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const handleClearAll = async () => {
    if (!userId) return;

    if (window.confirm(t("confirm_clear_all"))) {
      try {
        await deleteAllNotifications(userId).unwrap();
      } catch (error) {
        console.error("Failed to clear notifications", error);
      }
    }
  };

  return (
    <div className="notification-modal-overlay">
      <div className="notification-modal">
        <div className="notification-header">
          <h3>
            <BellFilled style={{ marginRight: 8, color: "#4e342e" }} />
            {t("notifications_title")}
          </h3>

          <div className="header-actions">
            {notifications.length > 0 && (
              <button onClick={handleClearAll} className="clear-all-btn">
                {t("clear_all") || "Clear"}
              </button>
            )}
            <button onClick={onClose} className="close-btn">
              <CloseOutlined />
            </button>
          </div>
        </div>

        <div className="notification-list">
          {notifications.length === 0 ? (
            <p className="no-notif">{t("no_notifications")}</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="notification-item">
                <div className="notif-content">
                  <p className="notif-message">{notif.message}</p>
                  <span className="notif-date">
                    {new Date(notif.createdAt).toLocaleDateString(
                      i18n.language,
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>

                <button
                  className="delete-item-btn"
                  onClick={() => handleDeleteOne(notif.id!)}
                  title={t("delete") || "Delete"}
                >
                  <DeleteOutlined />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
