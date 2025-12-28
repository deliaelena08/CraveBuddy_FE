import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./MapMarker.css";
import { useTranslation } from "react-i18next";

interface MapMarkerProps {
  position: { lat: number; lng: number };
}

export const MapMarker: React.FC<MapMarkerProps> = ({ position }) => {
  const customIcon = L.divIcon({
    html: `<div class="custom-marker">📍</div>`,
    iconSize: [40, 40],
    className: "",
  });
  const { t } = useTranslation();

  return (
    <Marker position={position} icon={customIcon}>
      <Popup>
        <b>{t("here")}:</b> <br />
        Cluj-Napoca, România
      </Popup>
    </Marker>
  );
};
