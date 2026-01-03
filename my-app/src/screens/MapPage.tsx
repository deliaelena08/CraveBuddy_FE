import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapPage.css";
import { SidebarMenu } from "../components/SideBarMenu/SideBarMenu";
import { MapMarker } from "../components/MapMarker/MapMarker";
import {
  useCreateBakeryMutation,
  useGetBakeriesQuery,
} from "../apis/bakeryQueryApi";
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
import { PlusOutlined } from "@ant-design/icons";
import { AddBakeryModal } from "../components/Modals/AddBakeryModal";

const defaultPosition = { lat: 46.7712, lng: 23.6236 };

const MapClickHandler = ({
  isActive,
  onLocationSelected,
}: {
  isActive: boolean;
  onLocationSelected: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      if (isActive) {
        onLocationSelected(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const MapRecenter = ({
  position,
  zoom,
  animate = false,
}: {
  position: { lat: number; lng: number };
  zoom?: number;
  animate?: boolean;
}) => {
  const map = useMap();
  const prevPosRef = useRef(position);

  useEffect(() => {
    prevPosRef.current = position;
    if (animate) {
      map.flyTo([position.lat, position.lng], zoom || map.getZoom(), {
        animate: true,
        duration: 2.0,
      });
    } else {
      map.setView([position.lat, position.lng], zoom || map.getZoom());
    }
  }, [position, zoom, map, animate]);

  return null;
};

export const MapPage: React.FC = () => {
  const { t } = useTranslation();
  const { notify } = useNotificationSystem();
  const navigate = useNavigate();
  const location = useLocation();

  const [position, setPosition] = useState(defaultPosition);
  const [zoomLevel, setZoomLevel] = useState(13);

  const [shouldAnimateMap, setShouldAnimateMap] = useState(false);

  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [showAddBakeryModal, setShowAddBakeryModal] = useState(false);
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [tempLocation, setTempLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const userStr = localStorage.getItem("user");
  const storedUser = userStr ? JSON.parse(userStr) : null;
  const userId = storedUser?.id;

  const currentUser: UserDto = storedUser
    ? ({
        id: storedUser.id,
        username: storedUser.username,
        role: storedUser.role || "USER",
        language: "RO",
        location: "",
        password: "",
      } as unknown as UserDto)
    : ({} as UserDto);

  const { data: bakeries = [] } = useGetBakeriesQuery();
  const { data: favourites = [] } = useGetFavouritesByUserIdQuery(userId!, {
    skip: !userId,
  });
  const { data: notificationList = [] } = useGetNotificationsQuery(userId!, {
    skip: !userId,
  });

  const [createBakery] = useCreateBakeryMutation();

  const targetCakeId = location.state?.targetCakeId;
  const { data: foundMenuItems, isSuccess: isMenuLoaded } =
    useGetMenuItemsByCakeIdQuery(targetCakeId!, {
      skip: !targetCakeId,
    });

  const isAdmin = currentUser.role === "ADMIN";
  const displayedBakeries = showFavouritesOnly
    ? bakeries.filter((b) => favourites.some((fav) => fav.bakery.id === b.id))
    : bakeries;

  useEffect(() => {
    if (targetCakeId && isMenuLoaded && foundMenuItems) {
      if (foundMenuItems.length > 0) {
        const foundBakery = foundMenuItems[0].bakery;

        if (foundBakery) {
          console.log("Zooming to bakery:", foundBakery.name);
          setShouldAnimateMap(true);

          setPosition({
            lat: foundBakery.longitude,
            lng: foundBakery.latitude,
          });
          setZoomLevel(18);

          notify(t("product_found_at", { name: foundBakery.name }), "success");
        }
      } else {
        notify(t("product_not_found_in_menu"), "error");
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [
    targetCakeId,
    isMenuLoaded,
    foundMenuItems,
    navigate,
    location.pathname,
    t,
    notify,
  ]);

  useEffect(() => {
    setShouldAnimateMap(false);

    if (showFavouritesOnly) {
      if (displayedBakeries.length === 0) {
        notify(t("no_favourites_yet"), "info");
      }
    } else {
    }
  }, [showFavouritesOnly, t, notify]);

  const handlePickLocationStart = () => {
    setShowAddBakeryModal(false);
    setIsPickingLocation(true);
    notify(
      t("click_map_hint") || "Click on the map to select location",
      "info"
    );
  };

  const handleLocationSelected = (lat: number, lng: number) => {
    setTempLocation({ lat, lng });
    setIsPickingLocation(false);
    setShowAddBakeryModal(true);
  };

  const handleSaveBakery = async (bakeryData: BakeryDto) => {
    try {
      const response = await createBakery(bakeryData).unwrap();
      notify(t("bakery_added_success"), "success");
      setShowAddBakeryModal(false);
      setTempLocation(null);
      if (response && response.id) {
        navigate(`/menu/${response.id}`);
      }
    } catch (error) {
      console.error("Failed to create bakery", error);
      notify(t("bakery_add_error"), "error");
    }
  };

  const bakeryIcon = L.icon({
    iconUrl: bakeryIconPng,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -36],
  });

  const tempIcon = L.divIcon({
    html: '<div style="font-size: 30px;">📍</div>',
    className: "temp-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  return (
    <div className="map-page-container">
      <Toaster
        position="top-center"
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

      {isAdmin && !isPickingLocation && (
        <button
          className="admin-add-btn"
          onClick={() => setShowAddBakeryModal(true)}
          title={t("add_bakery")}
        >
          <PlusOutlined style={{ fontSize: "24px", color: "white" }} />
        </button>
      )}

      {isPickingLocation && (
        <div
          className="picking-location-banner"
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2000,
            background: "rgba(255, 255, 255, 0.9)",
            padding: "10px 20px",
            borderRadius: "20px",
            fontWeight: "bold",
            border: "2px solid #6d4c41",
            color: "#6d4c41",
          }}
        >
          {t("select_location_btn")} (Click on Map)
          <button
            onClick={() => {
              setIsPickingLocation(false);
              setShowAddBakeryModal(true);
            }}
            style={{ marginLeft: 10, cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      )}

      <AddBakeryModal
        isOpen={showAddBakeryModal}
        onClose={() => {
          setShowAddBakeryModal(false);
          setTempLocation(null);
        }}
        onPickLocation={handlePickLocationStart}
        selectedLocation={tempLocation}
        onSave={handleSaveBakery}
      />

      <MapContainer
        center={defaultPosition}
        zoom={zoomLevel}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
      >
        <MapRecenter
          position={position}
          zoom={zoomLevel}
          animate={shouldAnimateMap}
        />

        <MapClickHandler
          isActive={isPickingLocation}
          onLocationSelected={handleLocationSelected}
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='© <a href="https://carto.com/">CARTO</a>'
        />

        {tempLocation && <Marker position={tempLocation} icon={tempIcon} />}

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
