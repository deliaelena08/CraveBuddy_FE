import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapPage.css";
import { SidebarMenu } from "../components/SideBarMenu/SideBarMenu";
import { MapMarker } from "../components/MapMarker/MapMarker";
import { useGetBakeriesQuery } from "../apis/bakeryQueryApi";
import { useGetFavouritesByUserIdQuery } from "../apis/favouriteQueryApi";
import { BakeryDto } from "../entities/bakery/BakeryDto";
import bakeryIconPng from "../assets/cake.png";
import { BakeryPopup } from "../components/Modals/BakeryPopup";
import { UserDto } from "../entities/user/UserDTO";
import { Toaster } from "react-hot-toast";
import { useGetNotificationsQuery } from "../apis/notificationQueryApi";
import { NotificationModal } from "../components/Modals/NotificationModal";
const defaultPosition = { lat: 46.7712, lng: 23.6236 };

export const MapPage: React.FC = () => {
  const [position, setPosition] = useState(defaultPosition);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const userStr = localStorage.getItem("user");
  const storedUser = userStr ? JSON.parse(userStr) : null;
  const userId = storedUser?.id;
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: notificationList = [] } = useGetNotificationsQuery(userId!, {
    skip: !userId,
  });

  const currentUser: UserDto = storedUser
    ? ({
        id: storedUser.id,
        username: storedUser.username,
        role: "USER",
        language: "RO",
        location: "",
        password: "",
      } as unknown as UserDto)
    : ({} as UserDto);

  const { data: bakeries = [] } = useGetBakeriesQuery();
  const { data: favourites = [] } = useGetFavouritesByUserIdQuery(userId!, {
    skip: !userId,
  });

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

  const displayedBakeries = showFavouritesOnly
    ? bakeries.filter((b) => favourites.some((fav) => fav.bakery.id === b.id))
    : bakeries;

  return (
    <div className="map-page-container">
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          top: 40,
          left: 20,
          bottom: 20,
          right: 20,
          zIndex: 99999,
        }}
      />

      <SidebarMenu
        onToggleFavourites={() => setShowFavouritesOnly(!showFavouritesOnly)}
        isShowingFavourites={showFavouritesOnly}
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
      />

      <NotificationModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notificationList}
      />

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='© <a href="https://carto.com/">CARTO</a>'
        />

        <MapMarker position={position} />

        {displayedBakeries.map((b: BakeryDto) => {
          const userFavourite = favourites.find(
            (fav) => fav.bakery.id === b.id
          );

          return (
            <Marker
              key={b.id}
              position={{ lat: b.longitude, lng: b.latitude }}
              icon={bakeryIcon}
            >
              <Popup>
                <BakeryPopup
                  bakery={b}
                  user={currentUser}
                  existingFavourite={userFavourite}
                />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
