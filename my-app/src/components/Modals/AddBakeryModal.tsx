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
  onAutoPin?: (lat: number, lng: number) => void;
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (selectedLocation) {
      setFormData((prev) => ({ ...prev, address: "Se caută adresa..." }));

      const fetchAddress = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.lat}&lon=${selectedLocation.lng}`,
          );
          const data = await response.json();

          if (data && data.address) {
            const road = data.address.road || "";
            const number = data.address.house_number || "";
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              formData.city;
            const cleanAddress = road
              ? `${road} ${number}`.trim()
              : data.display_name.split(",")[0];

            setFormData((prev) => ({
              ...prev,
              address: cleanAddress,
              city: city,
            }));

            setErrors((prev) => ({ ...prev, address: "", city: "" }));
          }
        } catch (error) {
          console.error("Eroare la preluarea adresei:", error);
          setFormData((prev) => ({ ...prev, address: "" }));
        }
      };

      fetchAddress();
    }
  }, [selectedLocation]);

  const handleClose = () => {
    setErrors({});
    setFormData({ name: "", address: "", city: "Cluj-Napoca" });
    onClose();
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t("err_name_req", "Numele cofetăriei este obligatoriu!");
    }
    if (!formData.address.trim()) {
      newErrors.address = t(
        "err_address_req",
        "Adresa fizică este obligatorie!",
      );
    }
    if (!formData.city.trim()) {
      newErrors.city = t("err_city_req", "Orașul este obligatoriu!");
    }
    if (!selectedLocation) {
      newErrors.location = t(
        "err_location_req",
        "Vă rugăm să alegeți locația pe hartă!",
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newBakery: BakeryDto = {
      name: formData.name,
      address: formData.address,
      latitude: selectedLocation!.lng,
      longitude: selectedLocation!.lat,
      city: formData.city || "Cluj-Napoca",
    };

    onSave(newBakery);
    setFormData({ name: "", address: "", city: "Cluj-Napoca" });
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
            className={`bakery-input ${errors.name ? "input-error" : ""}`}
            maxLength={50}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}

          <input
            name="address"
            placeholder={t("bakery_address")}
            value={formData.address}
            onChange={handleChange}
            className={`bakery-input ${errors.address ? "input-error" : ""}`}
            maxLength={100}
          />
          {errors.address && (
            <span className="error-text">{errors.address}</span>
          )}

          <input
            name="city"
            placeholder={t("bakery_city")}
            value={formData.city}
            onChange={handleChange}
            className={`bakery-input ${errors.city ? "input-error" : ""}`}
            maxLength={200}
          />
          {errors.city && <span className="error-text">{errors.city}</span>}

          <button
            className={`location-btn ${selectedLocation ? "selected" : ""} ${errors.location && !selectedLocation ? "input-error" : ""}`}
            onClick={onPickLocation}
            style={
              errors.location && !selectedLocation
                ? { borderColor: "#e53935", color: "#e53935" }
                : {}
            }
          >
            {selectedLocation
              ? t("location_selected")
              : t("select_location_btn")}
          </button>
          {errors.location && !selectedLocation && (
            <span className="error-text" style={{ textAlign: "center" }}>
              {errors.location}
            </span>
          )}
        </div>

        <div className="modal-actions">
          <button className="modal-btn cancel-btn" onClick={handleClose}>
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
