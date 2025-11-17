import React, { useState } from "react";
import "./BakeryPopup.css";
import { BakeryDto } from "../../entities/bakery/BakeryDto";
import { useNavigate } from "react-router-dom";
import { Navigation } from "lucide-react";

interface BakeryPopupProps {
  bakery: BakeryDto;
}

export const BakeryPopup: React.FC<BakeryPopupProps> = ({ bakery }) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const navigate = useNavigate();

  const handleSeeMenu = () => {
    navigate(`/menu/${bakery.id}`, { state: { bakeryName: bakery.name } });
  };

  const handleGetDirections = () => {
    const destination = `${bakery.longitude},${bakery.latitude}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleAddFavourite = () => {
    const newState = !isFavourite;
    setIsFavourite(newState);
    console.log(
      newState
        ? `Added ${bakery.name} to favourites`
        : `Removed ${bakery.name} from favourites`
    );
  };

  return (
    <div className="bakery-popup-container">
      <button
        className={`bakery-popup-star ${isFavourite ? "favourite" : ""}`}
        onClick={handleAddFavourite}
        aria-label="Add to favourites"
      >
        {isFavourite ? "★" : "☆"}
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
