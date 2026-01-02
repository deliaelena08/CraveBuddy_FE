import React, { useState, useEffect } from "react";
import "./AddBakeryModal.css";
import { useTranslation } from "react-i18next";
import { BakeryDto } from "../../entities/bakery/BakeryDto";

interface AddBakeryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPickLocation: () => void;
  selectedLocation: { lat: number; lng: number } | null;
  onSave: (bakeryData: BakeryDto) => void;
}

export const AddBakeryModal: React.FC<AddBakeryModalProps> = ({
  isOpen,
  onClose,
  onPickLocation,
  selectedLocation,
  onSave,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "Cluj-Napoca",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!selectedLocation) {
      alert(t("location_required"));
      return;
    }

    const newBakery: BakeryDto = {
      name: formData.name,
      address: formData.address,
      latitude: selectedLocation.lng,
      longitude: selectedLocation.lat,
      city: formData.city || "Cluj-Napoca",
    };

    onSave(newBakery);
  };

  return (
    <div className="add-bakery-overlay">
      <div className="add-bakery-modal">
        <h3 className="add-bakery-title">{t("add_bakery_title")}</h3>

        <div className="add-bakery-form">
          <input
            name="name"
            placeholder={t("bakery_name")}
            value={formData.name}
            onChange={handleChange}
            className="bakery-input"
          />

          <input
            name="address"
            placeholder={t("bakery_address")}
            value={formData.address}
            onChange={handleChange}
            className="bakery-input"
          />

          <input
            name="city"
            placeholder={t("bakery_city")}
            value={formData.city}
            onChange={handleChange}
            className="bakery-input"
          />

          <button
            className={`location-btn ${selectedLocation ? "selected" : ""}`}
            onClick={onPickLocation}
          >
            {selectedLocation
              ? t("location_selected")
              : t("select_location_btn")}
          </button>
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
