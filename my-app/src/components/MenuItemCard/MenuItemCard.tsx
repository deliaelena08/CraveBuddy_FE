import React, { useState } from "react";
import "./MenuItemCard.css";
import { MenuItemDto } from "../../entities/menuItem/MenuItemDto";

interface MenuItemCardProps {
  menuItem: MenuItemDto;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ menuItem }) => {
  const [showFullIngredients, setShowFullIngredients] = useState(false);

  const hasIngredients =
    menuItem.cake.ingredients && menuItem.cake.ingredients.trim().length > 0;
  const hasQuantity = menuItem.quantity && menuItem.quantity > 0;
  const hasSweetness = menuItem.cake.sweetness && menuItem.cake.sweetness > 0;
  const hasTexture =
    menuItem.cake.texture && menuItem.cake.texture.trim().length > 0;
  const hasFlavour =
    menuItem.cake.flavour &&
    menuItem.cake.flavour.trim().length > 0 &&
    menuItem.cake.flavour != null;

  const shouldTruncate =
    hasIngredients && menuItem.cake.ingredients.length > 60;

  const displayIngredients =
    shouldTruncate && !showFullIngredients
      ? menuItem.cake.ingredients.substring(0, 80) + "..."
      : menuItem.cake.ingredients;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  const hasDetails = hasQuantity || hasSweetness;
  const hasFooterInfo = hasTexture || hasFlavour;
  return (
    <div className="menu-item-card">
      <div className="menu-item-header">
        <h2 className="menu-item-name">{menuItem.cake.name}</h2>
        <span className="menu-item-price">{menuItem.price} RON</span>
      </div>

      <div className="menu-item-body">
        {hasIngredients && (
          <div className="menu-item-ingredients">
            <span className="ingredients-label">Ingredients:</span>
            <p className="ingredients-text">
              {displayIngredients}
              {shouldTruncate && (
                <button
                  className="see-more-btn"
                  onClick={() => setShowFullIngredients(!showFullIngredients)}
                >
                  {showFullIngredients ? "See less" : "See more"}
                </button>
              )}
            </p>
          </div>
        )}

        {hasDetails && (
          <div className="menu-item-details">
            {hasQuantity && (
              <div className="detail-item">
                <span className="detail-label">Quantity:</span>
                <span className="detail-value">{menuItem.quantity}g</span>
              </div>
            )}

            {hasSweetness && (
              <div className="detail-item">
                <span className="detail-label">Sweetness:</span>
                <div className="sweetness-rating">
                  {renderStars(menuItem.cake.sweetness)}
                  <span className="rating-number">
                    {menuItem.cake.sweetness}/10
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {hasFooterInfo && (
          <div className="menu-item-footer">
            <div className="footer-info">
              {hasTexture && (
                <span className="info-item">
                  <span className="info-label">Texture:</span>{" "}
                  {menuItem.cake.flavour}
                </span>
              )}
              {hasFlavour && (
                <span className="info-item">
                  <span className="info-label">Flavour:</span>{" "}
                  {menuItem.cake.texture}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
