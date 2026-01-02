import React, { useState, useEffect } from "react";
import "./AddBakeryModal.css";
import { useTranslation } from "react-i18next";
import { BakeryDto } from "../../entities/bakery/BakeryDto";

interface EditBakeryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bakery: BakeryDto | null;
  onSave: (id: number, data: BakeryDto) => void;
}

export const EditBakeryModal: React.FC<EditBakeryModalProps> = ({
  isOpen,
  onClose,
  bakery,
  onSave,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<BakeryDto>({
    id: 0,
    name: "",
    address: "",
    city: "Cluj-Napoca",
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if (bakery) {
      setFormData({
        id: bakery.id || 0,
        name: bakery.name || "",
        address: bakery.address || "",
        city: bakery.city || "Cluj-Napoca",
        latitude: bakery.latitude || 0,
        longitude: bakery.longitude || 0,
      });
    }
  }, [bakery]);

  if (!isOpen || !bakery) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(bakery.id!, formData);
    onClose();
  };

  return (
    <div className="add-bakery-overlay">
      <div className="add-bakery-modal">
        <h3 className="add-bakery-title">
          {t("edit_bakery_title") || "Edit Bakery"}
        </h3>

        <div className="add-bakery-form">
          <label
            style={{ textAlign: "left", fontSize: "0.85rem", color: "#6d4c41" }}
          >
            {t("bakery_name")}
          </label>
          <input
            name="name"
            className="bakery-input"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("bakery_name")}
          />

          <label
            style={{
              textAlign: "left",
              fontSize: "0.85rem",
              color: "#6d4c41",
              marginTop: 10,
            }}
          >
            {t("bakery_address")}
          </label>
          <input
            name="address"
            className="bakery-input"
            value={formData.address}
            onChange={handleChange}
            placeholder={t("bakery_address")}
          />

          <label
            style={{
              textAlign: "left",
              fontSize: "0.85rem",
              color: "#6d4c41",
              marginTop: 10,
            }}
          >
            {t("bakery_city")}
          </label>
          <input
            name="city"
            className="bakery-input"
            value={formData.city}
            onChange={handleChange}
            placeholder={t("bakery_city")}
          />
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
