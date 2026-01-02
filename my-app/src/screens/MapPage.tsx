import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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
import { useLocation, useNavigate } from "react-router-dom";
import { useGetMenuItemsByCakeIdQuery } from "../apis/menuItemQueryApi";
import { useTranslation } from "react-i18next";
import { useNotificationSystem } from "../utils/useNotificationSystem";

const defaultPosition = { lat: 46.7712, lng: 23.6236 };

const MapRecenter = ({
  position,
  zoom,
}: {
  position: { lat: number; lng: number };
  zoom?: number;
}) => {
  const map = useMap();

  useEffect(() => {
    const targetZoom = zoom || map.getZoom();
    map.setView([position.lat, position.lng], targetZoom);
  }, [position, zoom, map]);

  return null;
};

export const MapPage: React.FC = () => {
  const [position, setPosition] = useState(defaultPosition);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);

  const { t } = useTranslation();
  const { notify } = useNotificationSystem();
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const storedUser = userStr ? JSON.parse(userStr) : null;
  const userId = storedUser?.id;
  const [showNotifications, setShowNotifications] = useState(false);

  const location = useLocation();
  const targetCakeId = location.state?.targetCakeId;
  const [targetBakeryId, setTargetBakeryId] = useState<number | null>(null);

  const [handledCakeId, setHandledCakeId] = useState<number | null>(null);

  const { data: foundMenuItems } = useGetMenuItemsByCakeIdQuery(targetCakeId!, {
    skip: !targetCakeId,
  });

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

  const displayedBakeries = showFavouritesOnly
    ? bakeries.filter((b) => favourites.some((fav) => fav.bakery.id === b.id))
    : bakeries;

  useEffect(() => {
    if (targetCakeId && targetCakeId !== handledCakeId && foundMenuItems) {
      if (foundMenuItems.length > 0) {
        const foundBakery = foundMenuItems[0].bakery;

        if (foundBakery) {
          setPosition({
            lat: foundBakery.longitude,
            lng: foundBakery.latitude,
          });
          setTargetBakeryId(foundBakery.id!);
          setZoomLevel(16);

          notify(t("product_found_at", { name: foundBakery.name }), "success");

          setHandledCakeId(targetCakeId);
          navigate(location.pathname, { replace: true, state: {} });
        }
      } else if (foundMenuItems.length === 0) {
        notify(t("product_not_found_in_menu"), "error");
        setHandledCakeId(targetCakeId);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [
    foundMenuItems,
    targetCakeId,
    handledCakeId,
    t,
    notify,
    navigate,
    location.pathname,
  ]);

  useEffect(() => {
    if (showFavouritesOnly) {
      if (displayedBakeries.length > 0) {
        const firstFav = displayedBakeries[0];
        setPosition({ lat: firstFav.longitude, lng: firstFav.latitude });
      } else {
        notify(t("no_favourites_yet"), "info");
      }
    } else {
      if (!targetBakeryId) {
        setPosition(defaultPosition);
        setZoomLevel(13);
      }
    }
  }, [showFavouritesOnly, displayedBakeries.length, targetBakeryId, t, notify]);

  useEffect(() => {
    if (navigator.geolocation && !targetCakeId && !showFavouritesOnly) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
        },
        () => console.warn("Using default location")
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
        zoom={zoomLevel}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
      >
        <MapRecenter position={position} zoom={zoomLevel} />

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
