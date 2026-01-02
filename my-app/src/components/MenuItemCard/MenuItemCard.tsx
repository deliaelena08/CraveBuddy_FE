import React, { useState } from "react";
import "./MenuItemCard.css";
import { MenuItemDto } from "../../entities/menuItem/MenuItemDto";
import { useTranslation } from "react-i18next";
import { getLocalizedCake } from "../../utils/cakeUtils";

interface MenuItemCardProps {
  menuItem: MenuItemDto;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ menuItem }) => {
  const { t, i18n } = useTranslation();
  const [showFullIngredients, setShowFullIngredients] = useState(false);

  const displayCake = getLocalizedCake(menuItem.cake, i18n.language);

  const hasIngredients =
    displayCake.ingredients && displayCake.ingredients.trim().length > 0;
  const hasQuantity = menuItem.quantity && menuItem.quantity > 0;
  const hasSweetness = displayCake.sweetness && displayCake.sweetness > 0;
  const hasTexture =
    displayCake.texture && displayCake.texture.trim().length > 0;
  const hasFlavour =
    displayCake.flavour && displayCake.flavour.trim().length > 0;

  const shouldTruncate = hasIngredients && displayCake.ingredients.length > 60;

  const displayIngredients =
    shouldTruncate && !showFullIngredients
      ? displayCake.ingredients.substring(0, 80) + "..."
      : displayCake.ingredients;

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
        <h2 className="menu-item-name">{displayCake.name}</h2>
        <span className="menu-item-price">{menuItem.price} RON</span>
      </div>

      <div className="menu-item-body">
        {hasIngredients && (
          <div className="menu-item-ingredients">
            <span className="ingredients-label">{t("ingredients")}:</span>
            <p className="ingredients-text">
              {displayIngredients}
              {shouldTruncate && (
                <button
                  className="see-more-btn"
                  onClick={() => setShowFullIngredients(!showFullIngredients)}
                >
                  {showFullIngredients ? t("see_less") : t("see_more")}
                </button>
              )}
            </p>
          </div>
        )}

        {hasDetails && (
          <div className="menu-item-details">
            {hasQuantity && (
              <div className="detail-item">
                <span className="detail-label">{t("quantity")}:</span>
                <span className="detail-value">{menuItem.quantity}g</span>
              </div>
            )}

            {hasSweetness && (
              <div className="detail-item">
                <span className="detail-label">{t("sweetness")}:</span>
                <div className="sweetness-rating">
                  {renderStars(displayCake.sweetness)}
                  <span className="rating-number">
                    {displayCake.sweetness}/10
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
                  <span className="info-label">{t("texture")}:</span>{" "}
                  {displayCake.texture}
                </span>
              )}
              {hasFlavour && (
                <span className="info-item">
                  <span className="info-label">{t("flavour")}:</span>{" "}
                  {displayCake.flavour}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
