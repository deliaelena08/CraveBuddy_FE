import React from "react";
import "./NotificationModal.css";
import { NotificationDto } from "../../entities/notification/NotificationDto";
import { CloseOutlined, BellFilled } from "@ant-design/icons";

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
  if (!isOpen) return null;

  return (
    <div className="notification-modal-overlay">
      <div className="notification-modal">
        <div className="notification-header">
          <h3>
            <BellFilled style={{ marginRight: 8, color: "#4e342e" }} />
            Notifications
          </h3>
          <button onClick={onClose} className="close-btn">
            <CloseOutlined />
          </button>
        </div>

        <div className="notification-list">
          {notifications.length === 0 ? (
            <p className="no-notif">No new notifications.</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="notification-item">
                <p className="notif-message">{notif.message}</p>
                <span className="notif-date">
                  {new Date(notif.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
