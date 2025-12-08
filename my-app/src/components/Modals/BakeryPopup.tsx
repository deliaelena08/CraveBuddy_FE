import React from "react";
import "./BakeryPopup.css";
import { BakeryDto } from "../../entities/bakery/BakeryDto";
import { FavouriteDto } from "../../entities/favourite/FavouriteDto";
import { useNavigate } from "react-router-dom";
import { Navigation, Heart } from "lucide-react";
import {
  useCreateFavouriteMutation,
  useDeleteFavouriteMutation,
} from "../../apis/favouriteQueryApi";
import { UserDto } from "../../entities/user/UserDTO";
import { useNotificationSystem } from "../../utils/useNotificationSystem";

interface BakeryPopupProps {
  bakery: BakeryDto;
  user: UserDto;
  existingFavourite?: FavouriteDto;
}

export const BakeryPopup: React.FC<BakeryPopupProps> = ({
  bakery,
  user,
  existingFavourite,
}) => {
  const navigate = useNavigate();
  const { notify } = useNotificationSystem();
  const [createFavourite] = useCreateFavouriteMutation();
  const [deleteFavourite] = useDeleteFavouriteMutation();

  const isFavourite = !!existingFavourite;

  const handleSeeMenu = () => {
    navigate(`/menu/${bakery.id}`, { state: { bakeryName: bakery.name } });
  };

  const handleGetDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${bakery.latitude},${bakery.longitude}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleToggleFavourite = async () => {
    try {
      if (isFavourite) {
        await deleteFavourite(existingFavourite.id!).unwrap();
        notify(`Removed ${bakery.name} from favourites`, "info");
      } else {
        const newFav: FavouriteDto = {
          user: user,
          bakery: bakery,
          createdAt: new Date(),
        };
        await createFavourite(newFav).unwrap();
        notify(`Added ${bakery.name} to favourites! ❤️`, "success");
      }
    } catch (error) {
      console.error("Failed to update favourite", error);
      notify("Oops! Something went wrong.", "error");
    }
  };

  return (
    <div className="bakery-popup-container">
      <button
        className={`bakery-popup-star ${isFavourite ? "favourite" : ""}`}
        onClick={handleToggleFavourite}
        aria-label={
          isFavourite ? "Remove from favourites" : "Add to favourites"
        }
        style={{ border: "none", background: "transparent", cursor: "pointer" }}
      >
        <Heart
          size={24}
          fill={isFavourite ? "#ff4d4d" : "none"}
          color={isFavourite ? "#ff4d4d" : "gray"}
        />
      </button>

      <h3 className="bakery-popup-title">{bakery.name}</h3>
      <p className="bakery-popup-address">{bakery.address}</p>
      <p className="bakery-popup-city">{bakery.city}</p>

      <div className="bakery-popup-buttons">
        <button
          className="bakery-popup-button see-menu"
          onClick={handleSeeMenu}
        >
          See Menu
        </button>
        <button
          className="bakery-popup-button get-directions"
          onClick={handleGetDirections}
        >
          <Navigation size={16} />
          Get me there
        </button>
      </div>
    </div>
  );
};
