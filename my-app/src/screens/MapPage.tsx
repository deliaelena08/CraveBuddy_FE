import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapPage.css";
import { SidebarMenu } from "../components/SideBarMenu/SideBarMenu";
import { MapMarker } from "../components/MapMarker/MapMarker";
import { useGetBakeriesQuery } from "../apis/bakeryQueryApi";
import { BakeryDto } from "../entities/bakery/BakeryDto";
import bakeryIconPng from "../assets/cake.png";
import { BakeryPopup } from "../components/Modals/BakeryPopup";

const defaultPosition = { lat: 46.7712, lng: 23.6236 };

export const MapPage: React.FC = () => {
  const [position, setPosition] = useState(defaultPosition);
  const { data: bakeries = [] } = useGetBakeriesQuery();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
        },
        () => console.warn("Implicit location used: Cluj-Napoca")
      );
    }
  }, []);

  const bakeryIcon = L.icon({
    iconUrl: bakeryIconPng,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -36],
  });

  return (
    <div className="map-page-container">
      <SidebarMenu />

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        <MapMarker position={position} />

        {bakeries.map((b: BakeryDto) => (
          <Marker
            key={b.id}
            position={{ lat: b.longitude, lng: b.latitude }}
            icon={bakeryIcon}
          >
            <Popup>
              <BakeryPopup bakery={b} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
